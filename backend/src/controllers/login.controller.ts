import { db } from "@/DB_Client/db";
import { Request, Response, RequestHandler } from "express";
import { LoginSchema, SignupSchema } from "@/types/Zod/schema";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "@/types/Tokens";

// export const login: RequestHandler = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = LoginSchema.parse(req.body);
//     const User = await db.user.findUnique({
//       where: {
//         email: email,
//       },
//     });

//     if (!User) {
//       res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//       return;
//     }

//     const isMatch = await bcrypt.compare(password, User.password);
//     if (!isMatch) {
//       res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//       return;
//     }
//     const payload = {
//       id: User.id,
//       email: User.email,
//       name: User.name,
//     };
//     const token = await generateToken(payload);
//     if (!token) {
//       res.status(500).json({
//         message: "Error Generating Token",
//         success: false,
//       });
//       return;
//     }
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 24 * 60 * 60 * 1000,
//     });
//     res.status(200).json({
//       message: "Logged In Successfully",
//       name: payload.name,
//       success: true,
//     });
//   } catch (error: any) {
//     if (error.name === "ZodError") {
//       res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: error.errors,
//       });
//       return;
//     }
//     console.error("Sign in error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const User = await db.user.findUnique({
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

    const isMatch = await bcrypt.compare(password, User.password);
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

    // Assuming you have validated the user and generated a token
    const token = "your-generated-jwt-token"; // Replace with actual token generation
    const userName = "User Name"; // Replace with actual user data

    console.log("Login successful, setting cookie...");
    console.log("Token:", token);
    console.log("Request origin:", req.headers.origin);
    console.log("Request host:", req.headers.host);

    // Determine if we're in production
    const isProduction = process.env.NODE_ENV === "production";
    const isDevelopment = !isProduction;

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // Only secure in production
      sameSite: isProduction ? ("none" as const) : ("lax" as const), // 'none' for cross-origin in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: isProduction ? undefined : undefined, // Let browser handle domain
      path: "/",
    };

    console.log("Cookie options:", cookieOptions);

    // Set the cookie
    res.cookie("token", token, cookieOptions);

    // Also set a test cookie to verify cookies are working
    res.cookie("test", "working", {
      httpOnly: false, // This one should be visible in devtools
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("Cookies set, sending response...");

    // Send response
    res.status(200).json({
      success: true,
      message: "Logged In Successfully",
      name: userName,
      token: token, // You might want to remove this in production for security
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const SignUp: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const existingUser = await db.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
      return;
    }
    const newUser = await db.user.create({
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
    const token = await generateToken(payload);
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
  } catch (error: any) {
    console.error("Sign in error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};
