import { Router } from 'express';
import { postValidation } from '../validators/post.validation';
import { inputValidationMiddleware } from '../../../core/middleware/input-validation.middleware';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { getAllPostsHandler } from './handlers/get-all.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { removePostHandler } from './handlers/remove-post.handler';
import { idParamValidator } from '../../../core/validators/param-id.validation';
import { paginationAndSortingValidation } from '../../../core/validators/pagination-and-sorting.validation';
import { PostSortField } from './input/post-sort-field';

export const postsRouter: Router = Router();

postsRouter.get(
  '/',
  paginationAndSortingValidation(PostSortField),
  inputValidationMiddleware,
  getAllPostsHandler,
);

postsRouter.post(
  '/',
  superAdminGuardMiddleware,
  postValidation,
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
  postValidation,
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
