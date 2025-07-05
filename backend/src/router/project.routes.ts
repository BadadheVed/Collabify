import { Router } from "express";
import {
  CreateProject,
  getAllMyProjects,
  deleteProject,
} from "@/controllers/teams.controller";
import { getProjectTeams } from "@/controllers/tasks2.controller";
import { checkAuth } from "@/middlewares/roles";
import { CheckProjectRoles } from "@/middlewares/roles";
const projectRouter = Router();

// Create a new project
projectRouter.post("/", checkAuth, CreateProject);

// Delete a specific project
projectRouter.delete("/:projectId", checkAuth, deleteProject);
projectRouter.get("/UserProjects", checkAuth, getAllMyProjects);
projectRouter.get("/:projectId/teams", checkAuth, getProjectTeams);

export default projectRouter;
