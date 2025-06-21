import { Router } from "express";
import {
  createTasks,
  getTasksForProject,
  updateTask,
  deleteTask,
  GetTasks,
  ChangeStatus,
} from "@/controllers/tasks.controller";
import { getUserTasks } from "@/controllers/tasks2.controller";
import { checkAuth, CheckRoles } from "@/middlewares/roles";

const taskRouter = Router();
taskRouter.post("/", CheckRoles(["ADMIN", "MANAGER"]), createTasks);
taskRouter.patch("/:taskId", CheckRoles(["ADMIN", "MANAGER"]), updateTask);
taskRouter.delete("/:taskId", CheckRoles(["ADMIN", "MANAGER"]), deleteTask);
taskRouter.patch("/status/:taskId", checkAuth, ChangeStatus);
taskRouter.get("/user/tasks", checkAuth, getUserTasks);
taskRouter.get("/:projectId", checkAuth, getTasksForProject); // OR use GetTasks

export default taskRouter;
