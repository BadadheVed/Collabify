"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.CheckProjectRoles = exports.checkTeamMember = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("@/DB_Client/db");
const checkTeamMember = (roles) => {
    return async (req, res, next) => {
        const userId = req.user?.id; // ✅ already set by checkAuth
        const { teamId } = req.params;
        if (!userId || !teamId) {
            res.status(400).json({ message: "Missing user ID or project ID" });
            return;
        }
        try {
            const member = await db_1.db.teamMember.findFirst({
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
        }
        catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
    };
};
exports.checkTeamMember = checkTeamMember;
const CheckProjectRoles = (roles) => {
    return async (req, res, next) => {
        const userId = req.user?.id; // ✅ already set by checkAuth
        const { projectId } = req.params;
        if (!userId || !projectId) {
            res.status(400).json({ message: "Missing user ID or project ID" });
            return;
        }
        try {
            const member = await db_1.db.projectMember.findFirst({
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
        }
        catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
    };
};
exports.CheckProjectRoles = CheckProjectRoles;
const checkAuth = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decoded successfully:", {
            id: decoded.id,
            email: decoded.email,
        });
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log("❌ Token verification failed:", error);
        res.status(403).json({
            message: "Invalid Token",
            success: false,
        });
        return;
    }
};
exports.checkAuth = checkAuth;
