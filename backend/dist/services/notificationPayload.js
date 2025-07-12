"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNotificationMessage = void 0;
var buildNotificationMessage = exports.buildNotificationMessage = function buildNotificationMessage(type, payload) {
  switch (type) {
    case "USER_JOINED_TEAM":
      return "".concat(payload.userName, " has joined the team.");
    case "USER_LEFT_TEAM":
      return "".concat(payload.userName, " has left the team.");
    case "PROJECT_CREATED":
      return "".concat(payload.userName, " created a new project: ").concat(payload.projectName, ".");
    case "PROJECT_DELETED":
      return "".concat(payload.userName, " deleted the project: ").concat(payload.projectName, ".");
    case "DOCUMENT_CREATED":
      return "".concat(payload.userName, " created a new document: ").concat(payload.documentTitle, ".");
    case "DOCUMENT_DELETED":
      return "".concat(payload.userName, " deleted the document: ").concat(payload.documentTitle, ".");
    case "TASK_ASSIGNED":
      return "You've been assigned a new task: ".concat(payload.taskTitle, ".");
    default:
      return "You have a new notification.";
  }
};
//# sourceMappingURL=notificationPayload.js.map