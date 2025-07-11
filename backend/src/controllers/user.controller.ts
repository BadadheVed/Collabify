import { db } from "@/DB_Client/db";
import { Request, Response } from "express";
import { RequestHandler } from "express";
export const GetNotifications: RequestHandler = async (
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

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // newest first
    });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//PATCH /notifications/:id/mark-read

export const markNotificationAsRead: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    const notification = await db.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      res
        .status(404)
        .json({ success: false, message: "Notification not found" });
      return;
    }

    await db.notification.update({
      where: { id },
      data: { read: true },
    });

    res.status(200).json({ success: true, message: "Marked as read" });
    return;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};

//PATCH /notifications/mark-all-read

export const markAllNotificationsAsRead: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;

  try {
    await db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const UsersLive: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userIds = req.query.userIds;
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    const users = await db.user.findMany({
      where: { id: { in: ids as string[] } },
    });
    const resolved = users.map((u) => ({
      id: u.id,
      info: {
        name: u.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          u.name
        )}&background=random&color=fff&rounded=true`,
      },
    }));
    res.json(resolved);
  } catch (error) {
    console.error("Error resolving users:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const userSearch: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const text = req.query.text as string;
    if (!text) {
      res.status(400).send("Missing search text");
      return;
    }
    const users = await db.user.findMany({
      where: {
        name: {
          contains: text,
          mode: "insensitive",
        },
      },
      take: 5, // optional limit
    });

    const suggestions = users.map((u) => ({
      id: u.id,
      info: {
        name: u.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          u.name
        )}&background=random&color=fff&rounded=true`,
      },
    }));

    res.json(suggestions);
  } catch (error) {
    console.error("Error in user search:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getAuth: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
      });
    }

    res.status(200).json({
      success: true,
    });
    return;
  } catch (error) {
    console.error("Error in user search:", error);
    res.status(500).send("Internal Server Error");
  }
};
