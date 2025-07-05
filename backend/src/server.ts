import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import LoginRouter from "./router/auth.routes";
import dashboard from "./router/dashboard";
import teamRouter from "./router/teams.routes";
import documentRouter from "./router/document.routes";
import taskRouter from "./router/tasks.routes";
import notificationRouter from "./router/notification.routes";
import projectRouter from "./router/project.routes";
import cors from "cors";
import dotenv from "dotenv";
app.use(express.json());
app.use(cookieParser());
const furl = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: furl, // or your frontend URL
    credentials: true, // allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Added PATCH
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening On The Port ${PORT}`);
});
