import { db } from "@/DB_Client/db";
import { Request, Response } from "express";
import { RequestHandler } from "express";
// to get the user tasks
export const getUserTasks: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }
    

    const tasks = await db.task.findMany({
      where: {
        assignedToId: userId,
      },
      orderBy: {
        dueDate: "asc",
      },
      select: {
        id: true,
        title: true,
        status: true,
        dueDate: true,
        description: true,
        project: {
          select: {
            id: true,
            name: true,
            teams: {
              select: {
                id: true,
                name: true,
              },
              take: 1, // optional: just pick one team if multiple
            },
          },
        },
      },
    });

    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.dueDate,
      description: task.description,
      projectName: task.project.name,
      teamName: task.project.teams[0]?.name || "No Team Found",
    }));

    res.status(200).json({
      success: true,
      tasks: formattedTasks,
    });
    return;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    return;
  }
};

// to get teams by project
// GET /project/abc123/teams
//GET /project/abc123/teams?detailed=true this for when the tile is clicked

export const getProjectTeams = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  if (!projectId) {
    res.status(400).json({
      success: false,
      message: "Project ID is required",
    });
    return;
  }

  try {
    const teams = await db.team.findMany({
      where: {
        projectId,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedTeams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      members: team.members.map((member) => ({
        name: member.user.name,
        role: member.role,
      })),
    }));

    res.status(200).json({
      success: true,
      teams: formattedTeams,
    });
    return;
  } catch (error) {
    console.error("Error fetching project teams:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};
