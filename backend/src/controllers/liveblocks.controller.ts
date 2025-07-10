import { Request, RequestHandler, Response } from "express";
import { db } from "@/DB_Client/db";
import cookieParser from "cookie-parser";
import { verifyToken } from "@/types/Tokens";
import { Liveblocks } from "@liveblocks/node";
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});
export const authLiveblocks: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const name = req.user?.name;
    const { documentId } = req.body;
    if (!documentId) {
      res.status(400).send("Missing documentId");
      return;
    }
    if (!userId) {
      res.status(401).send("Missing user id");
      return;
    }

    const document = await db.document.findUnique({
      where: { id: documentId },
      select: { id: true, teamId: true },
    });

    if (!document) {
      res.status(404).send("Document not found");
      return;
    }

    const isTeamMember = await db.teamMember.findFirst({
      where: {
        userId,
        teamId: document.teamId,
      },
    });

    if (!isTeamMember) {
      res.status(403).send("User is not part of the document's team");
      return;
    }

    const roomId = `collabify:team:${document.teamId}:doc:${document.id}`;

    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: req.user?.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name ?? ""
        )}&background=random&color=fff&rounded=true`,
      },
    });

    session.allow(roomId, session.FULL_ACCESS);

    const { body, status } = await session.authorize();
    res.status(status).send(body);
  } catch (err) {
    console.error("Liveblocks Auth Error:", err);
    res.status(500).send("Internal server error");
  }
};
