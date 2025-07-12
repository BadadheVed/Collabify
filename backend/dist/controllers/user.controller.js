"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = exports.userSearch = exports.UsersLive = exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.GetNotifications = void 0;
const db_1 = require("@/DB_Client/db");
const GetNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const notifications = await db_1.db.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }, // newest first
        });
        res.status(200).json({ success: true, notifications });
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.GetNotifications = GetNotifications;
//PATCH /notifications/:id/mark-read
const markNotificationAsRead = async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    try {
        const notification = await db_1.db.notification.findUnique({
            where: { id },
        });
        if (!notification || notification.userId !== userId) {
            res
                .status(404)
                .json({ success: false, message: "Notification not found" });
            return;
        }
        await db_1.db.notification.update({
            where: { id },
            data: { read: true },
        });
        res.status(200).json({ success: true, message: "Marked as read" });
        return;
    }
    catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ success: false, message: "Server error" });
        return;
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
//PATCH /notifications/mark-all-read
const markAllNotificationsAsRead = async (req, res) => {
    const userId = req.user?.id;
    try {
        await db_1.db.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
        res
            .status(200)
            .json({ success: true, message: "All notifications marked as read" });
    }
    catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
const UsersLive = async (req, res) => {
    try {
        const userIds = req.query.userIds;
        const ids = Array.isArray(userIds) ? userIds : [userIds];
        const users = await db_1.db.user.findMany({
            where: { id: { in: ids } },
        });
        const resolved = users.map((u) => ({
            id: u.id,
            info: {
                name: u.name,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&color=fff&rounded=true`,
            },
        }));
        res.json(resolved);
    }
    catch (error) {
        console.error("Error resolving users:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.UsersLive = UsersLive;
const userSearch = async (req, res) => {
    try {
        const text = req.query.text;
        if (!text) {
            res.status(400).send("Missing search text");
            return;
        }
        const users = await db_1.db.user.findMany({
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
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&color=fff&rounded=true`,
            },
        }));
        res.json(suggestions);
    }
    catch (error) {
        console.error("Error in user search:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.userSearch = userSearch;
const getAuth = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error in user search:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.getAuth = getAuth;
