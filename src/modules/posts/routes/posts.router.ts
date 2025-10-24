import { Router } from 'express';
import { postValidator } from '../validators/post.validator';
import { inputValidationMiddleware } from '../../../core/middleware/input-validation.middleware';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { getAllPostsController } from './handlers/get-all.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { removePostHandler } from './handlers/remove-post.handler';
import { idParamValidator } from '../../../core/validators/param-id.validator';

export const postsRouter: Router = Router();

postsRouter.get('/', getAllPostsController);

postsRouter.post(
  '/',
  superAdminGuardMiddleware,
  postValidator,
  inputValidationMiddleware,
  createPostHandler,
);

postsRouter.get(
  '/:id',
  idParamValidator,
  inputValidationMiddleware,
  getPostByIdHandler,
);

postsRouter.put(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  postValidator,
  inputValidationMiddleware,
  updatePostHandler,
);

postsRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  inputValidationMiddleware,
  removePostHandler,
);
