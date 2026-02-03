import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import type { UserRole } from "../modules/auth/auth.types";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const payload = verifyAccessToken(token);

  req.user = {
    id: payload.userId,
    role: payload.role,
  };

  next();
};

export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };

export const isAdmin = authorize("ADMIN");
export const isModerator = authorize("ADMIN", "MODERATOR");
