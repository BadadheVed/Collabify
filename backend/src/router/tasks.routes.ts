import { Router } from "express";
import {
  createAndAssignTask,
  getTasksForTeam,
  updateTask,
  deleteTask,
  ChangeStatus,
} from "@/controllers/tasks.controller";
import { getUserTasks } from "@/controllers/tasks2.controller";
import {
  checkAuth,
  CheckProjectRoles,
  checkTeamMember,
} from "@/middlewares/roles";

const taskRouter = Router();
taskRouter.post("/create", checkAuth, createAndAssignTask);
taskRouter.patch("/update/:taskId", checkAuth, updateTask);
taskRouter.delete("/delete/:taskId", checkAuth, deleteTask);
taskRouter.patch("/status/:taskId", checkAuth, ChangeStatus);
taskRouter.get("/user/MyTasks", checkAuth, getUserTasks);
taskRouter.get("/all/:teamId", checkAuth, getTasksForTeam); // OR use GetTasks

export default taskRouter;
