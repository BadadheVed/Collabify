import jwt, { Jwt } from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = async (payload: TokenPayload) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string);
    return token;
  } catch (error: any) {
    throw new Error("Error Generating Token");
  }
};

export const verifyToken = (token: string) => {
  try {
    const isVerified = jwt.verify(token, process.env.JWT_SECRET as string);

    return isVerified;
  } catch (error) {
    throw new Error("Error Verifying Token");
  }
};

export const cookieOptions = {
  httpOnly: true, // Prevents client-side JS access
  secure: process.env.NODE_ENV === "production", // Only send over HTTPS in prod
  sameSite: "lax" as const, // CSRF protection (can be 'lax', 'strict', or 'none')
  path: "/", // Cookie valid for entire site
  // domain: ".thinkdeck.site", // applies to all thinkdeck.site subdomains
};
