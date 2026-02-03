import type { Request, Response } from "express";
import { PostService } from "./post.service";
import { catchAsync } from "../../utils/catchAsync";
import type {
  CreatePostInput,
  UpdatePostParams,
  UpdatePostInput,
  DeletePostParams,
} from "./post.types";

export class PostController {
  private readonly service = new PostService();

  createPost = catchAsync(
    async (req: Request<{}, {}, CreatePostInput>, res: Response) => {
      const post = await this.service.createPost(req.user!.id, req.body);
      res.status(201).json({ data: post });
    },
  );

  updatePost = catchAsync(
    async (
      req: Request<UpdatePostParams, {}, UpdatePostInput>,
      res: Response,
    ) => {
      const post = await this.service.updatePost(
        req.params.postId,
        req.user!.id,
        req.body,
      );
      res.status(200).json({ data: post });
    },
  );

  deletePost = catchAsync(
    async (req: Request<DeletePostParams>, res: Response) => {
      await this.service.deletePost(req.params.postId, req.user!.id);
      res.status(204).send();
    },
  );
}
