import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { posts } from "../../db/schema";
import type { CreatePostInput, UpdatePostInput } from "./post.types";
import { AppError } from "../../utils/AppError";

export class PostService {
  // Create Post
  async createPost(userId: string, data: CreatePostInput) {
    const { content, imageUrl, imagePublicId } = data;

    const [post] = await db
      .insert(posts)
      .values({ content, imageUrl, imagePublicId, userId })
      .returning();

    return post;
  }

  // Update Post
  async updatePost(postId: string, userId: string, data: UpdatePostInput) {
    const { content, imageUrl, imagePublicId } = data;

    const [post] = await db
      .update(posts)
      .set({ content, imageUrl, imagePublicId })
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
      .returning();

    if (!post) throw new AppError("Post not found or unauthorized", 404);

    return post;
  }

  // Delete Post
  async deletePost(postId: string, userId: string) {
    const deleted = await db
      .delete(posts)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
      .returning();

    if (!deleted.length) throw new AppError("Post not found or unauthorized", 404);
  }
}
