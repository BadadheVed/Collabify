"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_controller_1 = require("@/controllers/tasks.controller");
const tasks2_controller_1 = require("@/controllers/tasks2.controller");
const roles_1 = require("@/middlewares/roles");
const taskRouter = (0, express_1.Router)();
taskRouter.post("/create", roles_1.checkAuth, tasks_controller_1.createAndAssignTask);
taskRouter.patch("/update/:taskId", roles_1.checkAuth, tasks_controller_1.updateTask);
taskRouter.delete("/delete/:taskId", roles_1.checkAuth, tasks_controller_1.deleteTask);
taskRouter.patch("/status/:taskId", roles_1.checkAuth, tasks_controller_1.ChangeStatus);
taskRouter.get("/user/MyTasks", roles_1.checkAuth, tasks2_controller_1.getUserTasks);
taskRouter.get("/all/:teamId", roles_1.checkAuth, tasks_controller_1.getTasksForTeam); // OR use GetTasks
exports.default = taskRouter;
