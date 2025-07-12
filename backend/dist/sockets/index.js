"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSocketServer = exports.getIO = void 0;
var _socket = require("socket.io");
var io;
var initSocketServer = exports.initSocketServer = function initSocketServer(server) {
  io = new _socket.Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      // Replace with your frontend URL
      credentials: true
    }
  });
  io.on("connection", function (socket) {
    console.log("Socket ".concat(socket.id, " connected"));
    socket.on("join-room", function (userId) {
      socket.join(userId);
      console.log("User ".concat(userId, " joined their private room"));
    });
    socket.on("disconnect", function () {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
var getIO = exports.getIO = function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
//# sourceMappingURL=index.js.map