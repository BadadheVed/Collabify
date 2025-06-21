import { db } from "@/DB_Client/db";
import { Request, RequestHandler, Response } from "express";
//POST /projects/:projectId/documents
export const createDocument: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { projectId } = req.params;
  const { title } = req.body;
  const userId = req.user?.id;

  if (!title) {
    res.status(400).json({ message: "Title is required" });
    return;
  }

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { team: true },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const member = await db.teamMember.findFirst({
      where: {
        userId,
        teamId: project.teamId,
      },
    });

    if (!member) {
      res
        .status(403)
        .json({ message: "You do not have access to this project." });
      return;
    }

    const newDoc = await db.document.create({
      data: {
        title,
        content: {}, // or null if you prefer
        projectId,
      },
    });

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
//  Get a specific document (for loading into the editor).
export const getDocumentById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const document = await db.document.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    const isMember = await db.teamMember.findFirst({
      where: {
        teamId: document.project.teamId,
        userId,
      },
    });

    if (!isMember) {
      res.status(403).json({
        message: "You are not authorized to access this document",
      });
      return;
    }

    res.status(200).json({ document });
    return;
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
// router.get("/projects/:projectId/documents", checkAuth, getDocumentsByProject);
export const getDocumentsByProject: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { projectId } = req.params;
  const userId = req.user?.id;

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const isMember = await db.teamMember.findFirst({
      where: {
        teamId: project.teamId,
        userId,
      },
    });

    if (!isMember) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const documents = await db.document.findMany({
      where: { projectId },
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json({ documents });
    return;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

// router.patch("/documents/:id", checkAuth, updateDocumentContent);

export const SaveDocument: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;

  try {
    const document = await db.document.findUnique({
      where: { id },
      include: {
        project: { include: { team: true } },
      },
    });

    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    const isMember = await db.teamMember.findFirst({
      where: {
        teamId: document.project.teamId,
        userId,
      },
    });

    if (!isMember) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await db.document.update({
      where: { id },
      data: { content },
    });

    res.status(200).json({ message: "Document updated" });
    return;
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

// router.delete("/documents/:id", checkAuth, deleteDocument);
export const deleteDocument:RequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const document = await db.document.findUnique({
      where: { id },
      include: {
        project: { include: { team: true } },
      },
    });

    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    const isMember = await db.teamMember.findFirst({
      where: {
        teamId: document.project.teamId,
        userId,
      },
    });

    if (!isMember) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await db.document.delete({ where: { id } });

    res.status(200).json({ message: "Document deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
