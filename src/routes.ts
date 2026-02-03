import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import postRoutes from "./modules/post/post.routes";
import feedRoutes from "./modules/feed/feed.route";

const router = Router();

// health check
router.get("/health", (_req, res) => {
  res.status(200).json({ message: "Welcome to Flux API" });
});

// module routes
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/feed", feedRoutes);

export default router;
