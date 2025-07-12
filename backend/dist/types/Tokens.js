"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = async (payload) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
        return token;
    }
    catch (error) {
        throw new Error("Error Generating Token");
    }
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const isVerified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return isVerified;
    }
    catch (error) {
        throw new Error("Error Verifying Token");
    }
};
exports.verifyToken = verifyToken;
exports.cookieOptions = {
    httpOnly: true, // Prevents client-side JS access
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in prod
    sameSite: "lax", // CSRF protection (can be 'lax', 'strict', or 'none')
    path: "/", // Cookie valid for entire site
    // domain: ".thinkdeck.site", // applies to all thinkdeck.site subdomains
};
