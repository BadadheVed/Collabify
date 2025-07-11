import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http"; // ADD THIS

// Load environment variables first
dotenv.config(); // MOVE THIS TO TOP

const app = express();

// Create HTTP server
const server = createServer(app); // ADD THIS

// Initialize Socket.io BEFORE importing routes
import { initSocketServer } from "./sockets";
initSocketServer(server); // CALL THIS

// MOVE ALL ROUTE IMPORTS HERE (after Socket.io init)
import LoginRouter from "./router/auth.routes";
import dashboard from "./router/dashboard";
import teamRouter from "./router/teams.routes";
import documentRouter from "./router/document.routes";
import taskRouter from "./router/tasks.routes";
import notificationRouter from "./router/notification.routes";
import projectRouter from "./router/project.routes";
import liveblocksRouter from "./router/liveblocks.route";

app.use(express.json());
app.use(cookieParser());

const furl = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: furl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  })
);

app.use("/auth", LoginRouter);
app.use("/dashboard", dashboard);
app.use("/teams", teamRouter);
app.use("/documents", documentRouter);
app.use("/tasks", taskRouter);
app.use("/notifications", notificationRouter);
app.use("/projects", projectRouter);
app.use("/liveblocks", liveblocksRouter);

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(`Listening On The Port ${PORT}`);
});
