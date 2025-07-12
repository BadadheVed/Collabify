"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAssigned = exports.handleDocumentDeleted = exports.handleDocumentCreated = exports.handleProjectDeleted = exports.handleProjectCreated = exports.handleUserLeaveTeam = exports.handleUserJoinTeam = void 0;
const db_1 = require("@/DB_Client/db");
const notificationPayload_1 = require("./notificationPayload");
const sockets_1 = require("@/sockets");
const date_fns_1 = require("date-fns");
const io = (0, sockets_1.getIO)();
const handleUserJoinTeam = async (teamId, userId) => {
    try {
        const user = await db_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const message = (0, notificationPayload_1.buildNotificationMessage)("USER_JOINED_TEAM", {
            userName: user.name,
        });
        const members = await db_1.db.teamMember.findMany({
            where: {
                teamId,
                NOT: { userId },
            },
            select: { userId: true },
        });
        for (const member of members) {
            // Emit real-time notification
            io.to(member.userId).emit("notification", { message });
            // Save to DB
            await db_1.db.notification.create({
                data: {
                    userId: member.userId,
                    message,
                    expiresAt: (0, date_fns_1.addDays)(new Date(), 7),
                },
            });
        }
    }
    catch (error) {
        console.error("Error in User Joining Team Notification Part:", error);
    }
};
exports.handleUserJoinTeam = handleUserJoinTeam;
const handleUserLeaveTeam = async (teamId, userId) => {
    try {
        const user = await db_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const message = (0, notificationPayload_1.buildNotificationMessage)("USER_LEFT_TEAM", {
            userName: user.name,
        });
        const members = await db_1.db.teamMember.findMany({
            where: {
                teamId,
                NOT: { userId },
            },
            select: { userId: true },
        });
        for (const member of members) {
            io.to(member.userId).emit("notification", { message });
            await db_1.db.notification.create({
                data: {
                    userId: member.userId,
                    message,
                    expiresAt: (0, date_fns_1.addDays)(new Date(), 7),
                },
            });
        }
    }
    catch (error) {
        console.error("Error in User Leaving Team Notification Part:", error);
    }
};
exports.handleUserLeaveTeam = handleUserLeaveTeam;
const handleProjectCreated = async (userId, teamId, Pjname) => {
    // Pj name is the ProjectName
    try {
        const user = await db_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const message = (0, notificationPayload_1.buildNotificationMessage)("PROJECT_CREATED", {
            userName: user.name,
            projectName: Pjname,
        });
        const members = await db_1.db.teamMember.findMany({
            where: {
                teamId,
                NOT: { userId },
            },
            select: { userId: true },
        });
        for (const member of members) {
            io.to(member.userId).emit("notification", { message });
            await db_1.db.notification.create({
                data: {
                    userId: member.userId,
                    message,
                    expiresAt: (0, date_fns_1.addDays)(new Date(), 7),
                },
            });
        }
    }
    catch (error) {
        console.error("Error in creating project Notification Part:", error);
    }
};
exports.handleProjectCreated = handleProjectCreated;
const handleProjectDeleted = async (userId, teamId, Pjname) => {
    try {
        const user = await db_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const message = (0, notificationPayload_1.buildNotificationMessage)("PROJECT_DELETED", {
            userName: user.name,
            projectName: Pjname,
        });
        const members = await db_1.db.teamMember.findMany({
            where: {
                teamId,
                NOT: { userId },
            },
            select: { userId: true },
        });
        for (const member of members) {
            io.to(member.userId).emit("notification", { message });
            await db_1.db.notification.create({
                data: {
                    userId: member.userId,
                    message,
                    expiresAt: (0, date_fns_1.addDays)(new Date(), 7),
                },
            });
        }
    }
    catch (error) {
        console.error("Error in deleting project Notification Part:", error);
    }
};
exports.handleProjectDeleted = handleProjectDeleted;
const handleDocumentCreated = async (userId, teamId, DocTitle) => {
    try {
        const user = await db_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const message = (0, notificationPayload_1.buildNotificationMessage)("DOCUMENT_CREATED", {
            userName: user.name,
            documentTitle: DocTitle,
        });
        const members = await db_1.db.teamMember.findMany({
            where: {
                teamId,
                NOT: { userId },
            },
            select: { userId: true },
        });
        for (const member of members) {
            io.to(member.userId).emit("notification", { message });
            await db_1.db.notification.create({
                data: {
                    userId: member.userId,
                    message,
                    expiresAt: (0, date_fns_1.addDays)(new Date(), 7),
                },
            });
        }
    }
    catch (error) {
        console.error("Error in Creating Document Notification Part:", error);
    }
};
exports.handleDocumentCreated = handleDocumentCreated;
const handleDocumentDeleted = async (userId, teamId, DocTitle) => {
    try {
        const user = await db_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const message = (0, notificationPayload_1.buildNotificationMessage)("DOCUMENT_DELETED", {
            userName: user.name,
            documentTitle: DocTitle,
        });
        const members = await db_1.db.teamMember.findMany({
            where: {
                teamId,
                NOT: { userId },
            },
            select: { userId: true },
        });
        for (const member of members) {
            io.to(member.userId).emit("notification", { message });
            await db_1.db.notification.create({
                data: {
                    userId: member.userId,
                    message,
                    expiresAt: (0, date_fns_1.addDays)(new Date(), 7),
                },
            });
        }
    }
    catch (error) {
        console.error("Error in Deleting Document Notification Part:", error);
    }
};
exports.handleDocumentDeleted = handleDocumentDeleted;
const TaskAssigned = async (userId, taskTitle) => {
    try {
        const user = await db_1.db.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const message = (0, notificationPayload_1.buildNotificationMessage)("TASK_ASSIGNED", {
            taskTitle: taskTitle,
        });
        io.to(user.id).emit("notification", message);
        await db_1.db.notification.create({
            data: {
                userId: user.id,
                message: message,
                expiresAt: (0, date_fns_1.addDays)(new Date(), 7),
            },
        });
    }
    catch (error) {
        console.error("Error in Task AssignmentNotification Part:", error);
    }
};
exports.TaskAssigned = TaskAssigned;
