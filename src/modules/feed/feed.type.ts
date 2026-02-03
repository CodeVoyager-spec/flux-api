import { z } from "zod";
import { feedQuerySchema } from "./feed.validation";

export type FeedQuery = z.infer<typeof feedQuerySchema>["query"];

export type FeedPost = {
  id: string;
  content: string | null;
  imageUrl: string | null;
  createdAt: Date;

  author: {
    id: string;
    username: string;
    avatar: string | null;
  };

  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
};
