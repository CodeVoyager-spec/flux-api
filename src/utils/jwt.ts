import jwt from "jsonwebtoken";
import { AppError } from "./AppError";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

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

// Generate Refresh Token
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
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

// Verify Refresh Token
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Refresh token expired", 403);
    }

    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid refresh token", 403);
    }

    throw new AppError("Refresh token verification failed", 403);
  }
};
