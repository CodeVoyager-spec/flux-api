import { z } from "zod";
import { signinSchema, signupSchema, userRoleSchema } from "./auth.validation";

/**
 * Infer request body types from Zod schemas
 */
export type SignupBody = z.infer<typeof signupSchema>["body"];
export type SigninBody = z.infer<typeof signinSchema>["body"];

/**
 * User roles inferred from Zod enum
 */
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * JWT payload type
 */
export interface JwtPayload {
  userId: string;
  role: UserRole;
}

/**
 * Authenticated user interface
 */
export interface AuthUser {
  id: string;      
  username: string;
  email: string;
  role: UserRole;
}

/**
 * Extend Express Request to include authenticated user
 */
import { Request } from "express";
export interface AuthRequest extends Request {
  user?: AuthUser;
}
