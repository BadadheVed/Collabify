"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocketServer = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL, // Replace with your frontend URL
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log(`Socket ${socket.id} connected`);
        socket.on("join-room", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their private room`);
        });
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
};
exports.initSocketServer = initSocketServer;
const getIO = () => {
    if (!io)
        throw new Error("Socket.io not initialized");
    return io;
};
exports.getIO = getIO;
