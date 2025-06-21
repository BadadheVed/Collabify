// ✅ Corrected Controller Functions for Team & Project Management
import { db } from "@/DB_Client/db";
import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { RequestHandler } from "express";
export const CreateTeam: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!name || !userId) {
      res.status(400).json({ message: "Team name and user required." });
      return;
    }

    const team = await db.team.create({
      data: {
        name,
        createdBy: userId,
        members: {
          create: {
            userId,
            role: "ADMIN",
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: `Team created successfully`,
      teamId: team.id,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const InviteByLink: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { teamId, role } = req.body;
    const invitedById = req.user?.id;

    if (!invitedById) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = nanoid();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await db.invite.create({
      data: {
        token,
        teamId,
        role,
        invitedById,
        expiresAt,
        used: false,
      },
    });

    const inviteLink = `${process.env.FRONTEND_URL}/join-team/${token}`;
    res.status(201).json({
      success: true,
      message: "Invite link created successfully",
      inviteLink,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const ValidateInvite: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { token } = req.params;
  try {
    const invite = await db.invite.findUnique({
      where: { token },
      include: { team: true },
    });

    if (!invite || invite.used || new Date(invite.expiresAt) < new Date()) {
      res.status(400).json({ message: "Invalid or expired invite" });
      return;
    }

    res.status(200).json({
      success: true,
      teamName: invite.team.name,
      role: invite.role,
      token: invite.token,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const AcceptInvite: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { token } = req.params;
  const { isAccepting } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Login To Continue Joining",
    });
    return;
  }

  try {
    const invite = await db.invite.findUnique({
      where: { token },
      include: { team: true },
    });

    if (!invite || invite.used || new Date(invite.expiresAt) < new Date()) {
      res.status(410).json({ message: "Invite expired or used" });
      return;
    }

    if (!isAccepting) {
      res
        .status(200)
        .json({ message: `Invite to ${invite.team.name} rejected` });
      return;
    }

    await db.teamMember.create({
      data: {
        userId,
        teamId: invite.teamId,
        role: invite.role,
      },
    });

    await db.invite.update({
      where: { token },
      data: {
        used: true,
        invitedUserId: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: `You've joined the team "${invite.team.name}"`,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const CreateProject: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description, teamId } = req.body;
    const userId = req.user?.id;

    if (!userId || !name || !teamId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const member = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: { in: ["ADMIN", "MANAGER"] },
      },
    });

    if (!member) {
      res.status(403).json({ message: "Unauthorized to create project" });
      return;
    }

    const project = await db.project.create({
      data: {
        name,
        description,
        teamId,
        createdById: userId,
      },
    });

    res.status(201).json({ success: true, project });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const GetProjects: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { teamId } = req.params;

    if (!userId || !teamId) {
      res.status(400).json({ message: "Missing teamId or unauthorized" });
      return;
    }
    const isMember = await db.teamMember.findFirst({
      where: { userId, teamId },
    });

    if (!isMember) {
      res.status(403).json({ message: "You are not a member of this team" });
      return;
    }

    const projects = await db.project.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        createdBy: { select: { name: true } },
      },
    });

    res.status(200).json({ success: true, projects });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const deleteProject: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { teamId: true },
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const member = await db.teamMember.findFirst({
      where: { userId, teamId: project.teamId },
    });

    if (!member || !["ADMIN", "MANAGER"].includes(member.role)) {
      res
        .status(403)
        .json({ message: "Not authorized to delete this project" });
      return;
    }

    await db.project.delete({ where: { id: projectId } });

    res.status(200).json({ success: true, message: "Project deleted" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
