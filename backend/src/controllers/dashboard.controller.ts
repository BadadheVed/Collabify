import { db } from "@/DB_Client/db";
import { Request, Response, RequestHandler } from "express";

export const AdminDashboard = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};
