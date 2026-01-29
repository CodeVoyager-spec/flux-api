import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { AuthRequest, UserRole } from "../modules/auth/auth.types";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt";
import { NextFunction } from "express";

export const isAuthenticated = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return next(new AppError("No token provided", 401));

    const decoded = verifyAccessToken(token);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)
      .execute();

    if (!user) return next(new AppError("User not found", 404));

    // Attach full user info to request
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as UserRole,
    };

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Authorize middleware
 */
export const authorize =
  (...roles: UserRole[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));

    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Requires role: ${roles.join(", ")}`, 403));
    }

    next();
  };

// Convenience
export const isAdmin = authorize("ADMIN");
export const isModerator = authorize("ADMIN", "MODERATOR");
