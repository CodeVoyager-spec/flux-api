import { Router } from "express";
import { PostController } from "./post.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { createPostSchema, updatePostSchema } from "./post.validation";
import { uploadImage } from "../../middlewares/uploadImage";

const router = Router();
const controller = new PostController();

router.post(
  "/",
  isAuthenticated,
  validateRequest(createPostSchema),
  uploadImage.single("image"),
  controller.createPost,
);
router.put(
  "/:postId",
  isAuthenticated,
  validateRequest(updatePostSchema),
  uploadImage.single("image"),
  controller.updatePost,
);
router.delete("/:postId", isAuthenticated, controller.deletePost);

export default router;
