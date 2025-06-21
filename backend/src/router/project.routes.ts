import { Router } from "express";
import {
  CreateProject,
  GetProjects,
  deleteProject,
} from "@/controllers/teams.controller";

import { checkAuth } from "@/middlewares/roles";

const projectRouter = Router();

// Create a new project
projectRouter.post("/", checkAuth, CreateProject);

// Get all projects for a team
projectRouter.get("/:teamId", checkAuth, GetProjects);

// Delete a specific project
projectRouter.delete("/:projectId", checkAuth, deleteProject);

export default projectRouter;
