"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDocuments = exports.deleteDocument = exports.SaveDocument = exports.getDocumentsByProject = exports.getDocumentsByTeam = exports.getDocumentById = exports.createDocument = void 0;
const db_1 = require("@/DB_Client/db");
const notifications_service_1 = require("@/services/notifications.service");
// POST /teams/:teamId/documents - Create document in a specific team
const createDocument = async (req, res) => {
    const { teamId } = req.params;
    const { title } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (!title) {
        res.status(400).json({ message: "Title is required" });
        return;
    }
    try {
        // Check if the user is a member of the team
        const teamMember = await db_1.db.teamMember.findFirst({
            where: {
                userId,
                teamId,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!teamMember) {
            res.status(403).json({
                message: "You are not a member of this team.",
            });
            return;
        }
        // Create the document
        const newDoc = await db_1.db.document.create({
            data: {
                title,
                content: {}, // empty object by default
                teamId,
                ownerId: userId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        (0, notifications_service_1.handleDocumentCreated)(userId, newDoc.id, newDoc.title);
        res.status(201).json({
            message: "Document created successfully",
            document: newDoc,
        });
        return;
    }
    catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
exports.createDocument = createDocument;
// GET /documents/:id - Get a specific document
const getDocumentById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const document = await db_1.db.document.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!document) {
            res.status(404).json({ message: "Document not found" });
            return;
        }
        // Check if the user is a member of the team that owns this document
        const isMember = await db_1.db.teamMember.findFirst({
            where: {
                userId,
                teamId: document.teamId,
            },
        });
        if (!isMember) {
            res.status(403).json({
                message: "You are not authorized to access this document",
            });
            return;
        }
        // Return the document with all fields including content
        res.status(200).json({
            document: {
                id: document.id,
                title: document.title,
                content: document.content, // This will include the JSON content
                teamId: document.teamId,
                ownerId: document.ownerId,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt,
                owner: document.owner,
                team: document.team,
            },
        });
        return;
    }
    catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
};
exports.getDocumentById = getDocumentById;
// GET /teams/:teamId/documents - Get all documents for a specific team
const getDocumentsByTeam = async (req, res) => {
    const { teamId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        // First verify the team exists and user is a member
        const teamMember = await db_1.db.teamMember.findFirst({
            where: {
                userId,
                teamId,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                        project: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!teamMember) {
            res.status(403).json({
                message: "You are not a member of this team or team does not exist",
            });
            return;
        }
        // Get all documents for this specific team
        const documents = await db_1.db.document.findMany({
            where: {
                teamId: teamId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
        });
        res.status(200).json({
            documents,
            team: teamMember.team,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching documents by team:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
};
exports.getDocumentsByTeam = getDocumentsByTeam;
// GET /projects/:projectId/documents - Get all documents for all teams in a project
const getDocumentsByProject = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        // Get the project and its associated teams
        const project = await db_1.db.project.findUnique({
            where: { id: projectId },
            include: {
                teams: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        // Extract all team IDs related to the project
        const projectTeamIds = project.teams.map((team) => team.id);
        // Check if the user is a member of any of the project's teams
        const isMember = await db_1.db.teamMember.findFirst({
            where: {
                userId,
                teamId: {
                    in: projectTeamIds,
                },
            },
        });
        if (!isMember) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        // Get all documents from all teams in this project
        const documents = await db_1.db.document.findMany({
            where: {
                teamId: {
                    in: projectTeamIds,
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
        });
        res.status(200).json({
            documents,
            project: {
                id: project.id,
                name: project.name,
                teams: project.teams,
            },
        });
        return;
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
};
exports.getDocumentsByProject = getDocumentsByProject;
// PATCH /documents/:id - Update document content
const SaveDocument = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const document = await db_1.db.document.findUnique({
            where: { id },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!document) {
            res.status(404).json({ message: "Document not found" });
            return;
        }
        // Check if the user is a member of the team that owns this document
        const isMember = await db_1.db.teamMember.findFirst({
            where: {
                userId,
                teamId: document.teamId,
            },
        });
        if (!isMember) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const updatedDocument = await db_1.db.document.update({
            where: { id },
            data: { content },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        res.status(200).json({
            message: "Document updated successfully",
            document: updatedDocument,
        });
        return;
    }
    catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
};
exports.SaveDocument = SaveDocument;
// DELETE /documents/:id - Delete a document
const deleteDocument = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const document = await db_1.db.document.findUnique({
            where: { id },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!document) {
            res.status(404).json({ message: "Document not found" });
            return;
        }
        // Check if the user is a member of the team that owns this document
        const isMember = await db_1.db.teamMember.findFirst({
            where: {
                userId,
                teamId: document.teamId,
            },
        });
        if (!isMember) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        // Optional: Only allow document owner or team admin to delete
        // const teamMember = await db.teamMember.findFirst({
        //   where: {
        //     userId,
        //     teamId: document.teamId,
        //   },
        // });
        // if (document.ownerId !== userId && teamMember?.role !== "ADMIN") {
        //   res.status(403).json({
        //     message: "Only document owner or team admin can delete this document"
        //   });
        //   return;
        // }
        await db_1.db.document.delete({
            where: { id },
        });
        res.status(200).json({ message: "Document deleted successfully" });
        return;
    }
    catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
};
exports.deleteDocument = deleteDocument;
const getUserDocuments = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const documents = await db_1.db.document.findMany({
            where: {
                ownerId: userId,
            },
            select: {
                id: true,
                title: true,
                content: true,
                updatedAt: true,
                createdAt: true,
                team: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
        });
        const formattedDocuments = documents.map((d) => ({
            id: d.id,
            title: d.title,
            teamId: d.team.id,
            content: d.content,
            teamName: d.team.name,
            updatedAt: d.updatedAt,
            createdAt: d.createdAt,
        }));
        res.status(200).json({
            success: true,
            documents: formattedDocuments,
        });
    }
    catch (error) {
        console.error("Error fetching user documents:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getUserDocuments = getUserDocuments;
