"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const document_controller_1 = require("@/controllers/document.controller");
const roles_1 = require("@/middlewares/roles");
const documentRouter = (0, express_1.Router)();
// Apply checkAuth middleware to all document routes
documentRouter.use(roles_1.checkAuth);
documentRouter.get("/UserDocuments", document_controller_1.getUserDocuments);
// Create a new document in a specific team
// POST /teams/:teamId/documents
documentRouter.post("/:teamId/create", document_controller_1.createDocument);
// Get all documents for a specific team
// GET /teams/:teamId/documents
documentRouter.get("/:teamId/get", document_controller_1.getDocumentsByTeam);
// Get all documents for all teams in a project
// GET /projects/:projectId/documents
documentRouter.get("/projects/:projectId", document_controller_1.getDocumentsByProject);
// Get a specific document by its ID
// GET /documents/:id
documentRouter.get("/get/:id", document_controller_1.getDocumentById);
// Update (save) document content
// PATCH /documents/:id
documentRouter.patch("save/:id", document_controller_1.SaveDocument);
// Delete a document
// DELETE /documents/:id
documentRouter.delete("/:id", document_controller_1.deleteDocument);
exports.default = documentRouter;
