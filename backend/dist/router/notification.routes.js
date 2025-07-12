"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("@/controllers/user.controller");
const roles_1 = require("@/middlewares/roles");
const notificationRouter = (0, express_1.Router)();
// Get all notifications for the logged-in user
notificationRouter.get("/", roles_1.checkAuth, user_controller_1.GetNotifications);
// Mark a specific notification as read
notificationRouter.patch("/:id/mark-read", roles_1.checkAuth, user_controller_1.markNotificationAsRead);
// Mark all notifications as read
notificationRouter.patch("/mark-all-read", roles_1.checkAuth, user_controller_1.markAllNotificationsAsRead);
exports.default = notificationRouter;
