import { z } from "zod";
import { signinSchema, signupSchema } from "./auth.validation";

/**
 * Infer types
 */
export type signupBody = z.infer<typeof signupSchema>["body"];
export type signinBody = z.infer<typeof signinSchema>["body"];

export interface JwtPayload {
  userId: string;
  role: "USER" | "ADMIN" | "MODERATOR";
}
