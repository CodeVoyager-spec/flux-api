import { z } from "zod";

/**
 * Create Post
 */
export const createPostSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Post content is required")
      .max(1000, "Post too long"),

    imageUrl: z.url("Invalid image URL").optional(),
    imagePublicId: z.string().optional(),
  }),
});

/**
 * Update Post
 */
export const updatePostSchema = z.object({
  params: z.object({
    postId: z.uuid(),
  }),
  body: z.object({
    content: z.string().min(1).max(1000).optional(),

    imageUrl: z.string().url().nullable().optional(),
    imagePublicId: z.string().nullable().optional(),
  }),
});
