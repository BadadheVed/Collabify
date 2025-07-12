"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teams_controller_1 = require("@/controllers/teams.controller");
const tasks2_controller_1 = require("@/controllers/tasks2.controller");
const roles_1 = require("@/middlewares/roles");
const projectRouter = (0, express_1.Router)();
// Create a new project
projectRouter.post("/", roles_1.checkAuth, teams_controller_1.CreateProject);
// Delete a specific project
projectRouter.delete("/:projectId/delete", roles_1.checkAuth, teams_controller_1.deleteProject);
projectRouter.get("/UserProjects", roles_1.checkAuth, teams_controller_1.getAllMyProjects);
projectRouter.get("/:projectId/teams", roles_1.checkAuth, tasks2_controller_1.getProjectTeams);
projectRouter.get("/GetAdminProjects", roles_1.checkAuth, teams_controller_1.getAdminProjects);
exports.default = projectRouter;
