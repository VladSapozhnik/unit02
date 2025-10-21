import { Router } from 'express';
import { basePostValidator } from '../validators/posts/base-post.validator';
import { inputValidationMiddleware } from '../middleware/input-validation.middleware';
import { superAdminGuardMiddleware } from '../middleware/super-admin-guard.middleware';
import { getAllPostsController } from '../controllers/posts/get-all.controller';
import { createPostController } from '../controllers/posts/create-post.controller';
import { updatePostController } from '../controllers/posts/update-post.controller';
import { getPostByIdController } from '../controllers/posts/get-post-by-id.controller';
import { removePostController } from '../controllers/posts/remove-post.controller';
import { idParamValidator } from '../validators/param-id.validator';

export const postsRouter: Router = Router();

postsRouter.get('/', getAllPostsController);

postsRouter.post(
  '/',
  superAdminGuardMiddleware,
  basePostValidator,
  inputValidationMiddleware,
  createPostController,
);

postsRouter.get(
  '/:id',
  idParamValidator,
  inputValidationMiddleware,
  getPostByIdController,
);

postsRouter.put(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  basePostValidator,
  inputValidationMiddleware,
  updatePostController,
);

postsRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  inputValidationMiddleware,
  removePostController,
);
