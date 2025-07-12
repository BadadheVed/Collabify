"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = exports.login = void 0;
const db_1 = require("@/DB_Client/db");
const schema_1 = require("@/types/Zod/schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Tokens_1 = require("@/types/Tokens");
const login = async (req, res) => {
    try {
        const { email, password } = schema_1.LoginSchema.parse(req.body);
        const User = await db_1.db.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!User) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, User.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const payload = {
            id: User.id,
            email: User.email,
            name: User.name,
        };
        const token = await (0, Tokens_1.generateToken)(payload);
        if (!token) {
            res.status(500).json({
                message: "Error Generating Token",
                success: false,
            });
            return;
        }
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "Logged In Successfully",
            name: payload.name,
            success: true,
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors,
            });
            return;
        }
        console.error("Sign in error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.login = login;
const SignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPass = await bcrypt_1.default.hash(password, await bcrypt_1.default.genSalt(10));
        const existingUser = await db_1.db.user.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
            return;
        }
        const newUser = await db_1.db.user.create({
            data: {
                email: email,
                password: hashedPass,
                name: name,
            },
        });
        const payload = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
        };
        const token = await (0, Tokens_1.generateToken)(payload);
        if (!token) {
            res.status(500).json({
                message: "Error Generating Response",
                success: false,
            });
            return;
        }
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            token: token,
            message: "Sign Up Successful",
            name: payload.name,
            success: true,
        });
        return;
    }
    catch (error) {
        console.error("Sign in error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        return;
    }
};
exports.SignUp = SignUp;
