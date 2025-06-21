import { Request, Response, NextFunction } from "express";
import jwt, { decode } from "jsonwebtoken";
import { TokenPayload } from "@/types/Tokens";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const CheckRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
      res
        .status(401)
        .json({ message: "No Token Found, Please Login again to Continue" });
      return;
    }
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as TokenPayload;
      if (!roles.includes(decoded.role)) {
        res.status(401).json({
          message: "Unauthorised Access",
        });
        return;
      }
      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).json({ message: "Invalid Token" });
      return;
    }
  };
};

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      message: "No Token Found, Please Login again to Continue",
      success: false,
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;
    req.user = decoded; // decoded should have user id, etc.
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token", success: false });
    return;
  }
};
