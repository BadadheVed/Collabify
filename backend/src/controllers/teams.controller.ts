import { db } from "@/DB_Client/db";
import { Request, Response } from "express";
import crypto from "crypto";
import { Role } from "@prisma/client";
import { nanoid } from "nanoid";
export const CreateTeam = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    //const decoded = req.user;
    const { name } = req.body; // taking the team name input
    if (!name || !userId) {
      res.status(400).json({ message: "Team name and user required." });
      return;
    }
    const team = await db.team.create({
      data: {
        name: name,
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
      message: `Team Create Succesfully`,
      teamid: `Your Team ID is ${team.id}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const InviteByLink = async (req: Request, res: Response) => {
  try {
    const { teamId, role } = req.body;
    const invitedById = req.user?.id;
    if (!invitedById) {
      res.status(401).json({ message: "Unauthorized", success: false });
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
        // `email` and `invitedUserId` left null as you want invite-by-link (no email sent)
        // `userId` left null because user not joined yet
      },
    });
    const furl = process.env.FRONTEND_URL || "https://localhost:3000";
    const inviteLink = `${furl}/join-team/${token}`;
    res.status(201).send({
      message: "Invite Link Created Succesfully ",
      inviteLink,
      success: true,
    });
  } catch (error) {
    console.error("Error creating invite:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


