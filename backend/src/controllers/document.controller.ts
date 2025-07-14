import { db } from "@/DB_Client/db";
import { handleDocumentCreated } from "@/services/notifications.service";
import { Request, RequestHandler, Response } from "express";

// POST /teams/:teamId/documents - Create document in a specific team
export const createDocument: RequestHandler = async (
  req: Request,
  res: Response
) => {
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
    const teamMember = await db.teamMember.findFirst({
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
    const newDoc = await db.document.create({
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
    handleDocumentCreated(userId, newDoc.id, newDoc.title);

    res.status(201).json({
      message: "Document created successfully",
      document: newDoc,
    });
    return;
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

// GET /documents/:id - Get a specific document
export const getDocumentById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const document = await db.document.findUnique({
      where: { id },
    });

    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    // Check if the user is a member of the team that owns this document
    const isMember = await db.teamMember.findFirst({
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

    // ✅ Return only the required fields
    res.status(200).json({
      document: {
        id: document.id,
        title: document.title,
        content: document.content,
      },
      success: true,
    });
    return;
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

// GET /teams/:teamId/documents - Get all documents for a specific team
export const getDocumentsByTeam: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { teamId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // First verify the team exists and user is a member
    const teamMember = await db.teamMember.findFirst({
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
    const documents = await db.document.findMany({
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
  } catch (error) {
    console.error("Error fetching documents by team:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

// GET /projects/:projectId/documents - Get all documents for all teams in a project
export const getDocumentsByProject: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { projectId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // Get the project and its associated teams
    const project = await db.project.findUnique({
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
    const isMember = await db.teamMember.findFirst({
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
    const documents = await db.document.findMany({
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
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

// PATCH /documents/:id - Update document content
export const SaveDocument: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const document = await db.document.findUnique({
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
    const isMember = await db.teamMember.findFirst({
      where: {
        userId,
        teamId: document.teamId,
      },
    });

    if (!isMember) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const updatedDocument = await db.document.update({
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
    console.log("Saved Document Now at", Date.now());
    res.status(200).json({
      message: "Document updated successfully",
      document: updatedDocument,
    });
    return;
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

// DELETE /documents/:id - Delete a document
export const deleteDocument: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const document = await db.document.findUnique({
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
    const isMember = await db.teamMember.findFirst({
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

    await db.document.delete({
      where: { id },
    });

    res.status(200).json({ message: "Document deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const getUserDocuments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const documents = await db.document.findMany({
      where: {
        team: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
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
  } catch (error) {
    console.error("Error fetching user documents:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
