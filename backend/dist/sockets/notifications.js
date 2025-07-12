"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNotificationMessage = exports.sendNotificationToTeam = exports.SendNotificationsToUser = void 0;
const sockets_1 = require("@/sockets");
const db_1 = require("@/DB_Client/db");
const date_fns_1 = require("date-fns");
const io = (0, sockets_1.getIO)();
const SendNotificationsToUser = async (userId, message) => {
    try {
        // saving notification to the database
        await db_1.db.notification.create({
            data: {
                userId,
                message,
                expiresAt: (0, date_fns_1.addDays)(new Date(), 7),
            },
        });
        io.to(userId).emit("new-notification", { message });
    }
    catch (error) { }
};
exports.SendNotificationsToUser = SendNotificationsToUser;
const sendNotificationToTeam = async (teamId, message, excludeUserId) => {
    const teamMembers = await db_1.db.teamMember.findMany({
        where: {
            teamId: teamId,
            NOT: excludeUserId ? { userId: excludeUserId } : undefined,
        },
        select: { userId: true },
    });
    for (const member of teamMembers) {
        io.to(member.userId).emit("notification", message);
        await db_1.db.notification.create({
            data: {
                userId: member.userId,
                message,
                expiresAt: (0, date_fns_1.addDays)(new Date(), 7),
            },
        });
    }
};
exports.sendNotificationToTeam = sendNotificationToTeam;
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
