import { Router } from "express";
import {
  CreateTeam,
  InviteByLink,
  ValidateInvite,
  AcceptInvite,
  getTeamMembers,
  getUserTeams,
  getAdminTeams,
  RejectInvite,
} from "@/controllers/teams.controller";

import {
  checkAuth,
  CheckProjectRoles,
  checkTeamMember,
} from "@/middlewares/roles";

const teamRouter = Router();

// Create a new team
// teamRouter.post(
//   "/:projectId/create",
//   checkAuth,

//   CreateTeam
// );

teamRouter.post(
  "/create",
  checkAuth,

  CreateTeam
);
// Generate invite link
teamRouter.post("/invite", checkAuth, InviteByLink);

// Validate invite token
teamRouter.get("/invite/validate/:token", ValidateInvite);

// Accept invite link
teamRouter.post("/invite/accept/:token", checkAuth, AcceptInvite);
teamRouter.post("/invites/reject/:token", RejectInvite);
teamRouter.get(
  "/:teamId/members",
  checkAuth,

  getTeamMembers
);
teamRouter.get("/MyTeams", checkAuth, getUserTeams);
teamRouter.get("/AdminTeams", checkAuth, getAdminTeams);
export default teamRouter;
