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
