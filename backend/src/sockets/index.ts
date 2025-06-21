import { Server, Socket } from "socket.io";
let io: Server;
export const initSocketServer = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
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

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
