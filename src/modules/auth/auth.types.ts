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
