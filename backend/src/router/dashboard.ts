import { AdminDashboard } from "@/controllers/dashboard.controller";
import { Router } from "express";
import { CheckRoles } from "@/middlewares/roles";
const dashboard = Router();
dashboard.get("/", CheckRoles(["Admin"]), AdminDashboard);
export default dashboard;
