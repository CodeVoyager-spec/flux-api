import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import postRoutes from "./modules/post/post.routes";

const router = Router();

// health check
router.get("/health", (_req, res) => {
  res.status(200).json({ message: "Welcome to Flux API" });
});

// module routes
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);

export default router;
