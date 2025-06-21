import { Router } from "express";
import {
  createDocument,
  getDocumentById,
  getDocumentsByProject,
  SaveDocument,
  deleteDocument,
} from "@/controllers/document.controller";
import { checkAuth } from "@/middlewares/roles";

const documentRouter = Router();

// Create a new document under a specific project
// POST /projects/:projectId/documents
documentRouter.post(
  "/projects/:projectId/documents",
  checkAuth,
  createDocument
);

// Get all documents under a specific project
// GET /projects/:projectId/documents
documentRouter.get(
  "/projects/:projectId/documents",
  checkAuth,
  getDocumentsByProject
);

// Get a specific document by its ID
// GET /documents/:id
documentRouter.get("/documents/:id", checkAuth, getDocumentById);

// Update (save) document content
// PATCH /documents/:id
documentRouter.patch("/documents/:id", checkAuth, SaveDocument);

// Delete a document
// DELETE /documents/:id
documentRouter.delete("/documents/:id", checkAuth, deleteDocument);

export default documentRouter;
