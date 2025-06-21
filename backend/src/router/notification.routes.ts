import { Router } from "express";
import {
  GetNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/controllers/user.controller";
import { checkAuth } from "@/middlewares/roles";

const notificationRouter = Router();

// Get all notifications for the logged-in user
notificationRouter.get("/", checkAuth, GetNotifications);

// Mark a specific notification as read
notificationRouter.patch("/:id/mark-read", checkAuth, markNotificationAsRead);

// Mark all notifications as read
notificationRouter.patch(
  "/mark-all-read",
  checkAuth,
  markAllNotificationsAsRead
);

export default notificationRouter;
