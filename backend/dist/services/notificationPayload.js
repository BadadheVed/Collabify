"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNotificationMessage = void 0;
const buildNotificationMessage = (type, payload) => {
    switch (type) {
        case "USER_JOINED_TEAM":
            return `${payload.userName} has joined the team.`;
        case "USER_LEFT_TEAM":
            return `${payload.userName} has left the team.`;
        case "PROJECT_CREATED":
            return `${payload.userName} created a new project: ${payload.projectName}.`;
        case "PROJECT_DELETED":
            return `${payload.userName} deleted the project: ${payload.projectName}.`;
        case "DOCUMENT_CREATED":
            return `${payload.userName} created a new document: ${payload.documentTitle}.`;
        case "DOCUMENT_DELETED":
            return `${payload.userName} deleted the document: ${payload.documentTitle}.`;
        case "TASK_ASSIGNED":
            return `You've been assigned a new task: ${payload.taskTitle}.`;
        default:
            return "You have a new notification.";
    }
};
exports.buildNotificationMessage = buildNotificationMessage;
