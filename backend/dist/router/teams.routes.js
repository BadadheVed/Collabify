"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teams_controller_1 = require("@/controllers/teams.controller");
const roles_1 = require("@/middlewares/roles");
const teamRouter = (0, express_1.Router)();
// Create a new team
// teamRouter.post(
//   "/:projectId/create",
//   checkAuth,
//   CreateTeam
// );
teamRouter.post("/create", roles_1.checkAuth, teams_controller_1.CreateTeam);
// Generate invite link
teamRouter.post("/invite", roles_1.checkAuth, teams_controller_1.InviteByLink);
// Validate invite token
teamRouter.get("/invite/validate/:token", teams_controller_1.ValidateInvite);
// Accept invite link
teamRouter.post("/invite/accept/:token", roles_1.checkAuth, teams_controller_1.AcceptInvite);
teamRouter.post("/invites/reject/:token", teams_controller_1.RejectInvite);
teamRouter.get("/:teamId/members", roles_1.checkAuth, teams_controller_1.getTeamMembers);
teamRouter.get("/MyTeams", roles_1.checkAuth, teams_controller_1.getUserTeams);
teamRouter.get("/AdminTeams", roles_1.checkAuth, teams_controller_1.getAdminTeams);
exports.default = teamRouter;
