"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _tasks = require("../controllers/tasks.controller");
var _tasks2 = require("../controllers/tasks2.controller");
var _roles = require("../middlewares/roles");
var taskRouter = (0, _express.Router)();
taskRouter.post("/create", _roles.checkAuth, _tasks.createAndAssignTask);
taskRouter.patch("/update/:taskId", _roles.checkAuth, _tasks.updateTask);
taskRouter["delete"]("/delete/:taskId", _roles.checkAuth, _tasks.deleteTask);
taskRouter.patch("/status/:taskId", _roles.checkAuth, _tasks.ChangeStatus);
taskRouter.get("/user/MyTasks", _roles.checkAuth, _tasks2.getUserTasks);
taskRouter.get("/all/:teamId", _roles.checkAuth, _tasks.getTasksForTeam); // OR use GetTasks
var _default = exports["default"] = taskRouter;
//# sourceMappingURL=tasks.routes.js.map