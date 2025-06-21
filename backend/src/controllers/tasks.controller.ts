import { db } from "@/DB_Client/db";
import { Request, Response } from "express";
import { RequestHandler } from "express";
export const createTasks: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.body;
    const { title, description, dueDate, assignedToId } = req.body;
    if (!userId || !projectId || !title) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
      return;
    }
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { teamId: true },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const member = await db.teamMember.findFirst({
      where: {
        teamId: project.teamId,
        userId,
      },
    });

    if (!member || (member.role !== "ADMIN" && member.role !== "MANAGER")) {
      res.status(403).json({
        success: false,
        message: "Only Admin or Manager can create tasks",
      });
      return;
    }
    const task = await db.task.create({
      data: {
        title,
        description,
        assigneeId: userId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedToId,
        projectId,
      },
    });

    res.status(201).json({
      success: true,
      task,
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};

export const getTasksForProject: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { teamId: true },
    });
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const member = await db.teamMember.findFirst({
      where: { teamId: project.teamId, userId },
    });
    if (!member) {
      res.status(403).json({ success: false, message: "Unauthorized" });
      return;
    }

    const tasks = await db.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, tasks });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};

// PATCH /api/tasks/:taskId
export const updateTask: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate, assignedToId } =
      req.body;

    const task = await db.task.findUnique({
      where: { id: taskId },
      include: { project: { select: { teamId: true } } },
    });

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    const member = await db.teamMember.findFirst({
      where: { teamId: task.project.teamId, userId },
    });

    if (!member || (member.role !== "ADMIN" && member.role !== "MANAGER")) {
      res.status(403).json({
        success: false,
        message: "Only Admin or Manager can update tasks",
      });
      return;
    }

    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedToId,
      },
    });

    res.status(200).json({ success: true, task: updatedTask });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};

// DELETE /api/tasks/:taskId
export const deleteTask: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { taskId } = req.params;

    const task = await db.task.findUnique({
      where: { id: taskId },
      include: { project: { select: { teamId: true } } },
    });

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    const member = await db.teamMember.findFirst({
      where: { teamId: task.project.teamId, userId },
    });

    if (!member || (member.role !== "ADMIN" && member.role !== "MANAGER")) {
      res.status(403).json({
        success: false,
        message: "Only Admin or Manager can delete tasks",
      });
      return;
    }

    await db.task.delete({ where: { id: taskId } });

    res.status(200).json({ success: true, message: "Task deleted" });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};

// get all tasks for the project with the help of the projectId
// GET /api/tasks/:projectId
export const GetTasks: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;
    if (!userId || !projectId) {
      res.status(400).json({
        success: false,
        message: "Missing projectId or unauthorized",
      });
      return;
    }
    const project = await db.project.findFirst({
      where: { id: projectId },
      select: { teamId: true },
    });
    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const isMember = await db.teamMember.findFirst({
      where: {
        teamId: project.teamId,
        userId,
      },
    });
    if (!isMember) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to view tasks for this project",
      });
      return;
    }

    const tasks = await db.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).json({
      success: true,
      tasks,
    });
    return;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    return;
  }
};

// PATCH /tasks/status/:taskId

export const ChangeStatus: RequestHandler = async (
  req: Request,
  res: Response
) => {
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
    // find the task
    const task = await db.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        project: {
          select: {
            teamId: true,
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

    const isMember = await db.teamMember.findFirst({
      where: {
        userId,
        teamId: task.project.teamId,
      },
    });

    if (!isMember) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to update this task",
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
