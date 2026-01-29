import { Router } from "express";

const router = Router();

// health check
router.get("/health", (_req, res) => {
  res.status(200).json({ message: "Welcome to Flux API" });
});

// module routes

export default router;
