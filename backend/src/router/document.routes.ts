import { Router } from "express";
import {
  createDocument,
  getDocumentById,
  getDocumentsByProject,
  getDocumentsByTeam,
  SaveDocument,
  deleteDocument,
  getUserDocuments,
} from "@/controllers/document.controller";
import { checkAuth } from "@/middlewares/roles";

const documentRouter = Router();

// Apply checkAuth middleware to all document routes
documentRouter.use(checkAuth);
documentRouter.get("/UserDocuments", getUserDocuments);
// Create a new document in a specific team
// POST /teams/:teamId/documents
documentRouter.post("/:teamId/create", createDocument);

// Get all documents for a specific team
// GET /teams/:teamId/documents
documentRouter.get("/:teamId/get", getDocumentsByTeam);

// Get all documents for all teams in a project
// GET /projects/:projectId/documents
documentRouter.get("/projects/:projectId", getDocumentsByProject);

// Get a specific document by its ID
// GET /documents/:id
documentRouter.get("/get/:id", getDocumentById);

// Update (save) document content
// PATCH /documents/:id
documentRouter.patch("/save/:id", SaveDocument);

// Delete a document
// DELETE /documents/:id
documentRouter.delete("/:id", deleteDocument);

export default documentRouter;
