import { z } from "zod";

/** Zod enum aligned with UserRole */
export const UserRoleEnum = z.enum(["USER", "ADMIN", "MODERATOR"]);

/** Signup */
export const signupSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: UserRoleEnum.default("USER"),
  }),
});

/** Signin */
export const signinSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});
