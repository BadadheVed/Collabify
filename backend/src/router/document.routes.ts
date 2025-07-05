import { Router } from "express";
import {
  createDocument,
  getDocumentById,
  getDocumentsByProject,
  getDocumentsByTeam,
  SaveDocument,
  deleteDocument,
} from "@/controllers/document.controller";
import { checkAuth } from "@/middlewares/roles";

const documentRouter = Router();

// Apply checkAuth middleware to all document routes
documentRouter.use(checkAuth);

// Create a new document in a specific team
// POST /teams/:teamId/documents
documentRouter.post("/teams/:teamId", createDocument);

// Get all documents for a specific team
// GET /teams/:teamId/documents
documentRouter.get("/teams/:teamId", getDocumentsByTeam);

// Get all documents for all teams in a project
// GET /projects/:projectId/documents
documentRouter.get("/projects/:projectId", getDocumentsByProject);

// Get a specific document by its ID
// GET /documents/:id
documentRouter.get("/:id", getDocumentById);

// Update (save) document content
// PATCH /documents/:id
documentRouter.patch("/:id", SaveDocument);

// Delete a document
// DELETE /documents/:id
documentRouter.delete("/:id", deleteDocument);

export default documentRouter;
