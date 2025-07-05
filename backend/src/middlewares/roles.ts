import { Request, Response, NextFunction } from "express";
import jwt, { decode } from "jsonwebtoken";
import { TokenPayload } from "@/types/Tokens";
import { db } from "@/DB_Client/db";
import { Role } from "@prisma/client";
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const checkTeamMember = (roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id; // ✅ already set by checkAuth
    const { teamId } = req.params;

    if (!userId || !teamId) {
      res.status(400).json({ message: "Missing user ID or project ID" });
      return;
    }

    try {
      const member = await db.teamMember.findFirst({
        where: {
          userId,
          teamId,
          role: { in: roles },
        },
      });

      if (!member) {
        res.status(403).json({ message: "Unauthorized Access" });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  };
};
export const CheckProjectRoles = (roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id; // ✅ already set by checkAuth
    const { projectId } = req.params;

    if (!userId || !projectId) {
      res.status(400).json({ message: "Missing user ID or project ID" });
      return;
    }

    try {
      const member = await db.projectMember.findFirst({
        where: {
          userId,
          projectId,
          role: { in: roles },
        },
      });

      if (!member) {
        res.status(403).json({ message: "Unauthorized Access" });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  };
};

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log("🔍 Auth middleware called");
  console.log("🍪 All cookies:", req.cookies);
  console.log("📋 Headers:", req.headers.cookie);

  const token = req.cookies.token;

  if (!token) {
    console.log("❌ No token found in cookies");
    res.status(401).json({
      message: "No Token Found, Please Login again to Continue",
      success: false,
    });
    return;
  }

  console.log("✅ Token found:", token.substring(0, 20) + "...");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    console.log("✅ Token decoded successfully:", {
      id: decoded.id,
      email: decoded.email,
    });

    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error);
    res.status(403).json({
      message: "Invalid Token",
      success: false,
    });
    return;
  }
};
