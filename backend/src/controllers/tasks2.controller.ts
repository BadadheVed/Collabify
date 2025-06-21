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
        project: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!tasks) {
      res.status(401).json({
        success: false,
        message: "There Are no tasks assigned to you Right Now",
      });
      return;
    }
    res.status(200).json({
      success: true,
      tasks,
    });
    return;
  } catch (error) {
    console.error("Error fetching tasks assigned to user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    return;
  }
};
