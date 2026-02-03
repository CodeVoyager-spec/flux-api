import { Request, Response } from "express";
import { FeedService } from "./feed.service";
import { feedQuerySchema } from "./feed.validation";

const feedService = new FeedService();

export class FeedController {
  static async getFeed(req: Request, res: Response) {
    const { query } = feedQuerySchema.parse(req);

    const posts = await feedService.getFeed(req.user!.id, query);

    res.json({
      page: query.page,
      limit: query.limit,
      data: posts,
    });
  }
}
