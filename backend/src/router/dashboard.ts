//import { DashBoard } from "@/controllers/dashboard.controller";
import { Router } from "express";

import { getTileData } from "@/controllers/dashboard.controller";
import { checkAuth } from "@/middlewares/roles";

const dashboard = Router();
//ashboard.get("/", CheckRoles(["Admin"]), DashBoard);
dashboard.get("/tiledata", checkAuth, getTileData);
export default dashboard;
