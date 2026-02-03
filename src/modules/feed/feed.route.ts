import { Router } from "express";
import { FeedController } from "./feed.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * GET /api/feed
 * Query params: page, limit
 * Auth required
 */
router.get("/", isAuthenticated, FeedController.getFeed);

export default router;
