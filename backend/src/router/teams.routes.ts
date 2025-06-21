import { Router } from "express";
import {
  CreateTeam,
  InviteByLink,
  ValidateInvite,
  AcceptInvite,
} from "@/controllers/teams.controller";

import { checkAuth } from "@/middlewares/roles";

const teamRouter = Router();

// Create a new team
teamRouter.post("/create", checkAuth, CreateTeam);

// Generate invite link
teamRouter.post("/invite", checkAuth, InviteByLink);

// Validate invite token
teamRouter.get("/invite/validate/:token", ValidateInvite);

// Accept invite link
teamRouter.post("/invite/accept/:token", checkAuth, AcceptInvite);

export default teamRouter;
