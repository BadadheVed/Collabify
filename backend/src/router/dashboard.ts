import { AdminDashboard } from "@/controllers/dashboard.controller";
import { Router } from "express";
import { CheckRoles } from "@/middlewares/roles";
import { CreateTeam, InviteByLink } from "@/controllers/teams.controller";
const dashboard = Router();
dashboard.get("/", CheckRoles(["Admin"]), AdminDashboard);
dashboard.post("/team/create", CreateTeam);
dashboard.post("/team/invite", InviteByLink);
export default dashboard;
