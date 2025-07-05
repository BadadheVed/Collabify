//import { DashBoard } from "@/controllers/dashboard.controller";
import { Router } from "express";

import { CreateTeam, InviteByLink } from "@/controllers/teams.controller";
const dashboard = Router();
//ashboard.get("/", CheckRoles(["Admin"]), DashBoard);
dashboard.post("/team/create", CreateTeam);
dashboard.post("/team/invite", InviteByLink);
export default dashboard;
