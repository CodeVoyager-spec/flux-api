// src/modules/post/post.service.ts
import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { posts } from "../../db/schema";
import { CreatePostInput, UpdatePostInput } from "./post.types";
import { AppError } from "../../utils/AppError";

export class PostService {
  async createPost(userId: string, data: CreatePostInput) {
    const [post] = await db
      .insert(posts)
      .values({ ...data, userId })
      .returning();

    return post;
  }

  async updatePost(
    postId: string,
    userId: string,
    data: UpdatePostInput
  ) {
    const [post] = await db
      .update(posts)
      .set(data)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
      .returning();

    if (!post) {
      throw new AppError("Post not found or unauthorized", 404);
    }

    return post;
  }

  async deletePost(postId: string, userId: string) {
    const [post] = await db
      .delete(posts)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
      .returning();

    if (!post) {
      throw new AppError("Post not found or unauthorized", 404);
    }

    return post;
  }
}
