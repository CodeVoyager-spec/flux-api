import { z } from "zod";

/**
 * Signup schema
 */
export const signupSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(1, "Username is required") 
      .min(3, "Username must be at least 3 characters"),

    email: z
      .string()
      .min(1, "Email is required") 
      .email("Invalid email format"),

    password: z
      .string()
      .min(1, "Password is required") // covers missing/empty string
      .min(6, "Password must be at least 6 characters"),
  }),
});

/**
 * Signin schema
 */
export const signinSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
  }),
});

