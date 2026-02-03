import { Request, Response } from "express";
import { PostService } from "./post.service";
import { catchAsync } from "../../utils/catchAsync";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../../utils/cloudinary";
import type {
  CreatePostInput,
  UpdatePostInput,
  UpdatePostParams,
  DeletePostParams,
} from "./post.types";

export class PostController {
  private postService = new PostService();

  createPost = catchAsync(
    async (req: Request<{}, {}, CreatePostInput>, res: Response) => {
      const userId = req.user!.id;

      let imageData;
      if (req.file) {
        const uploaded = await uploadImageToCloudinary(req.file.buffer, "posts");
        imageData = { url: uploaded.secure_url, publicId: uploaded.public_id };
      }

      const post = await this.postService.createPost(userId, {
        ...req.body,
        imageUrl: imageData?.url,
        imagePublicId: imageData?.publicId,
      });

      res.status(201).json({ data: post });
    },
  );

  updatePost = catchAsync(
    async (
      req: Request<UpdatePostParams, {}, UpdatePostInput>,
      res: Response,
    ) => {
      const userId = req.user!.id;
      const { postId } = req.params;

      let imageData = {};
      if (req.file) {
        const uploaded = await uploadImageToCloudinary(req.file.buffer, "posts",);
        imageData = { imageUrl: uploaded.secure_url, imagePublicId: uploaded.public_id };
      }

      const post = await this.postService.updatePost(postId, userId, {
        ...req.body,
        ...imageData,
      });

      res.status(200).json({ data: post });
    },
  );

  deletePost = catchAsync(
    async (req: Request<DeletePostParams>, res: Response) => {
      const userId = req.user!.id;
      const { postId } = req.params;

      const post = await this.postService.deletePost(postId, userId);

      if (post.imagePublicId) {
        await deleteImageFromCloudinary(post.imagePublicId);
      }

      res.status(204).json({ message: "Post deleted successfully" });
    },
  );
}
