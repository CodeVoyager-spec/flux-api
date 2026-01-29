import jwt from "jsonwebtoken";
import { AppError } from "./AppError";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRES_IN = "15m";

export interface JwtPayload {
  userId: string;
  role?: string;
}

// Generate Access Token
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

// Verify Access Token
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Access token expired", 401);
    }

    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid access token", 401);
    }

    throw new AppError("Unauthorized", 401);
  }
};
