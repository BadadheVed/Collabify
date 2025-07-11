import { db } from "@/DB_Client/db";
import { TaskAssigned } from "@/services/notifications.service";
import { Request, Response } from "express";
import { RequestHandler } from "express";

export const createAndAssignTask: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { title, description, dueDate, teamId, assignedToId } = req.body;

    if (!userId || !title || !teamId || !assignedToId) {
      res.status(400).json({
        success: false,
        message: "Missing required fields (title, teamId, assignedToId)",
      });
      return;
    }

    // Get team with its project info
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: { project: true },
    });

    if (!team) {
      res.status(404).json({
        success: false,
        message: "Team not found",
      });
      return;
    }

    // Check if the user is an Admin or Manager in this specific team
    const isAdminOrManager = await db.teamMember.findFirst({
      where: {
        userId,
        teamId,
        role: {
          in: ["ADMIN", "MANAGER"],
        },
      },
    });

    if (!isAdminOrManager) {
      res.status(403).json({
        success: false,
        message: "Only Admin or Manager can create tasks in this team",
      });
      return;
    }

    // Ensure the assigned user is part of this team
    const targetMember = await db.teamMember.findFirst({
      where: { teamId, userId: assignedToId },
    });

    if (!targetMember) {
      res.status(400).json({
        success: false,
        message: "Assigned user is not a member of this team",
      });
      return;
    }

    // Create and assign the task
    const task = await db.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        projectId: team.projectId, // Get projectId from team
        assignedToId,
        assigneeId: userId, // creator of the task
      },
    });
    TaskAssigned(userId, task.title);

    res.status(201).json({
      success: true,
      message: "Task created and assigned successfully",
      task,
    });
    return;
  } catch (error) {
    console.error("Error creating and assigning task:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};

// get tasks for a specific team
export const getTasksForTeam: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { teamId } = req.params;

    if (!userId || !teamId) {
      res.status(400).json({
        success: false,
        message: "Missing teamId or unauthorized",
      });
      return;
    }

    // Get team with its project info
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: { project: true },
    });

    if (!team) {
      res.status(404).json({ success: false, message: "Team not found" });
      return;
    }

    // Check if the user is an Admin/Manager in this specific team
    const member = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: {
          in: ["ADMIN", "MANAGER"],
        },
      },
    });

    if (!member) {
      res.status(403).json({
        success: false,
        message: "Only Admin or Manager can view tasks of this team",
      });
      return;
    }

    // Fetch tasks for this team (tasks belong to project, but we filter by team members)
    const tasks = await db.task.findMany({
      where: {
        projectId: team.projectId,
        assignedTo: {
          teams: {
            some: {
              teamId: teamId,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      tasks,
    });
    return;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    return;
  }
};

// PATCH /api/tasks/:taskId
export const updateTask: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate, assignedToId } =
      req.body;

    if (!userId || !taskId) {
      res.status(400).json({
        success: false,
        message: "Missing taskId or unauthorized",
      });
      return;
    }

    // Get the task along with its project and project.teams
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            teams: true,
          },
        },
        assignedTo: {
          include: {
            teams: true,
          },
        },
      },
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // Find which team the assigned user belongs to in this project
    const assignedUserTeam = task.assignedTo.teams.find((teamMember) =>
      task.project.teams.some(
        (projectTeam) => projectTeam.id === teamMember.teamId
      )
    );

    if (!assignedUserTeam) {
      res.status(400).json({
        success: false,
        message: "Task's assigned user is not part of any team in this project",
      });
      return;
    }

    // Check if the user is a member of the same team as the assigned user
    const isTeamMember = await db.teamMember.findFirst({
      where: {
        userId,
        teamId: assignedUserTeam.teamId,
      },
    });

    if (!isTeamMember) {
      res.status(403).json({
        success: false,
        message: "You are not a member of the team that owns this task",
      });
      return;
    }

    // Validate assignedToId only if it's being changed
    if (assignedToId) {
      const isAssignedUserInSameTeam = await db.teamMember.findFirst({
        where: {
          userId: assignedToId,
          teamId: assignedUserTeam.teamId,
        },
      });

      if (!isAssignedUserInSameTeam) {
        res.status(400).json({
          success: false,
          message: "Assigned user is not part of the same team",
        });
        return;
      }
    }

    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedToId: assignedToId || undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
    return;
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    return;
  }
};

// DELETE /api/tasks/:taskId
export const deleteTask: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { taskId } = req.params;

    if (!userId || !taskId) {
      res.status(400).json({
        success: false,
        message: "Missing taskId or unauthorized",
      });
      return;
    }

    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: { teams: true },
        },
        assignedTo: {
          include: {
            teams: true,
          },
        },
      },
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // Find which team the assigned user belongs to in this project
    const assignedUserTeam = task.assignedTo.teams.find((teamMember) =>
      task.project.teams.some(
        (projectTeam) => projectTeam.id === teamMember.teamId
      )
    );

    if (!assignedUserTeam) {
      res.status(400).json({
        success: false,
        message: "Task's assigned user is not part of any team in this project",
      });
      return;
    }

    // Check if the user is an Admin or Manager in the same team as the assigned user
    const isAdminOrManager = await db.teamMember.findFirst({
      where: {
        userId,
        teamId: assignedUserTeam.teamId,
        role: {
          in: ["ADMIN", "MANAGER"],
        },
      },
    });

    if (!isAdminOrManager) {
      res.status(403).json({
        success: false,
        message: "Only Admin or Manager can delete tasks in this team",
      });
      return;
    }

    await db.task.delete({ where: { id: taskId } });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
    return;
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};

// PATCH /tasks/status/:taskId
export const ChangeStatus: RequestHandler = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;
    const { status } = req.body;

    if (!userId || !taskId || !status) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
      return;
    }

    // Fetch task with assigned user and project teams
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            teams: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            teams: true,
          },
        },
      },
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // Find which team the assigned user belongs to in this project
    const assignedUserTeam = task.assignedTo.teams.find((teamMember) =>
      task.project.teams.some(
        (projectTeam) => projectTeam.id === teamMember.teamId
      )
    );

    if (!assignedUserTeam) {
      res.status(400).json({
        success: false,
        message: "Task's assigned user is not part of any team in this project",
      });
      return;
    }

    const isAssignedUser = task.assignedTo?.id === userId;

    const isAdminOrManager = await db.teamMember.findFirst({
      where: {
        userId,
        teamId: assignedUserTeam.teamId,
        role: {
          in: ["ADMIN", "MANAGER", "MEMBER"],
        },
      },
    });

    if (!isAssignedUser && !isAdminOrManager) {
      res.status(403).json({
        success: false,
        message:
          "Only the assigned user or an Admin/Manager of the same team can change status",
      });
      return;
    }

    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask,
    });
    return;
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    return;
  }
};
