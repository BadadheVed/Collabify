"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _user = require("../controllers/user.controller");
var _roles = require("../middlewares/roles");
var notificationRouter = (0, _express.Router)();

// Get all notifications for the logged-in user
notificationRouter.get("/", _roles.checkAuth, _user.GetNotifications);

// Mark a specific notification as read
notificationRouter.patch("/:id/mark-read", _roles.checkAuth, _user.markNotificationAsRead);

// Mark all notifications as read
notificationRouter.patch("/mark-all-read", _roles.checkAuth, _user.markAllNotificationsAsRead);
var _default = exports["default"] = notificationRouter;
//# sourceMappingURL=notification.routes.js.map