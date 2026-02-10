import { db } from "../../db";
import { posts, follows } from "../../db/schema";
import { FeedPost, FeedQuery } from "./feed.type";
import { desc, eq, inArray } from "drizzle-orm";

export class FeedService {
  async getFeed(userId: string, query: FeedQuery): Promise<FeedPost[]> {
    const { page, limit } = query;
    const offset = (page - 1) * limit;

    const feedPosts = await db.query.posts.findMany({
      where: (post, { inArray }) =>
        inArray(
          post.userId,
          db
            .select({ id: follows.followingId })
            .from(follows)
            .where(eq(follows.followerId, userId))
        ),
      orderBy: (p, { desc }) => desc(p.createdAt),
      limit,
      offset,
      with: {
        author: { columns: { id: true, username: true, avatarUrl: true }, required: true },
        likes: { columns: { userId: true } },
        comments: { columns: { id: true } },
      },
    });

    // Map to FeedPost safely
    return feedPosts.map<FeedPost>((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        username: post.author.username,
        avatar: post.author.avatarUrl ?? null,
      },
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      isLiked: post.likes .some((like) => like.userId === userId),
    }));
  }
}
