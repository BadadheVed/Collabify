"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _teams = require("../controllers/teams.controller");
var _roles = require("../middlewares/roles");
var teamRouter = (0, _express.Router)();

// Create a new team
// teamRouter.post(
//   "/:projectId/create",
//   checkAuth,

//   CreateTeam
// );

teamRouter.post("/create", _roles.checkAuth, _teams.CreateTeam);
// Generate invite link
teamRouter.post("/invite", _roles.checkAuth, _teams.InviteByLink);

// Validate invite token
teamRouter.get("/invite/validate/:token", _teams.ValidateInvite);

// Accept invite link
teamRouter.post("/invite/accept/:token", _roles.checkAuth, _teams.AcceptInvite);
teamRouter.post("/invites/reject/:token", _teams.RejectInvite);
teamRouter.get("/:teamId/members", _roles.checkAuth, _teams.getTeamMembers);
teamRouter.get("/MyTeams", _roles.checkAuth, _teams.getUserTeams);
teamRouter.get("/AdminTeams", _roles.checkAuth, _teams.getAdminTeams);
var _default = exports["default"] = teamRouter;
//# sourceMappingURL=teams.routes.js.map