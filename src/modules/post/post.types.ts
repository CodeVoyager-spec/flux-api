import { z } from "zod";
import { createPostSchema, updatePostSchema } from "./post.validation";

/**
 * Request body types
 */
export type CreatePostInput = z.infer<typeof createPostSchema>["body"];
export type UpdatePostInput = z.infer<typeof updatePostSchema>["body"];
export type UpdatePostParams = z.infer<typeof updatePostSchema>["params"];
