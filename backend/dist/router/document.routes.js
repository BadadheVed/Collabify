"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _document = require("../controllers/document.controller");
var _roles = require("../middlewares/roles");
var documentRouter = (0, _express.Router)();

// Apply checkAuth middleware to all document routes
documentRouter.use(_roles.checkAuth);
documentRouter.get("/UserDocuments", _document.getUserDocuments);
// Create a new document in a specific team
// POST /teams/:teamId/documents
documentRouter.post("/:teamId/create", _document.createDocument);

// Get all documents for a specific team
// GET /teams/:teamId/documents
documentRouter.get("/:teamId/get", _document.getDocumentsByTeam);

// Get all documents for all teams in a project
// GET /projects/:projectId/documents
documentRouter.get("/projects/:projectId", _document.getDocumentsByProject);

// Get a specific document by its ID
// GET /documents/:id
documentRouter.get("/get/:id", _document.getDocumentById);

// Update (save) document content
// PATCH /documents/:id
documentRouter.patch("save/:id", _document.SaveDocument);

// Delete a document
// DELETE /documents/:id
documentRouter["delete"]("/:id", _document.deleteDocument);
var _default = exports["default"] = documentRouter;
//# sourceMappingURL=document.routes.js.map