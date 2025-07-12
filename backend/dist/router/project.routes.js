"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _teams = require("../controllers/teams.controller");
var _tasks = require("../controllers/tasks2.controller");
var _roles = require("../middlewares/roles");
var projectRouter = (0, _express.Router)();

// Create a new project
projectRouter.post("/", _roles.checkAuth, _teams.CreateProject);

// Delete a specific project
projectRouter["delete"]("/:projectId/delete", _roles.checkAuth, _teams.deleteProject);
projectRouter.get("/UserProjects", _roles.checkAuth, _teams.getAllMyProjects);
projectRouter.get("/:projectId/teams", _roles.checkAuth, _tasks.getProjectTeams);
projectRouter.get("/GetAdminProjects", _roles.checkAuth, _teams.getAdminProjects);
var _default = exports["default"] = projectRouter;
//# sourceMappingURL=project.routes.js.map