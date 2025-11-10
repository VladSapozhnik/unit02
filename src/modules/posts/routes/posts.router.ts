import { Router } from 'express';
import { postValidation } from '../validators/post.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { getAllPostsHandler } from './handlers/get-all.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { removePostHandler } from './handlers/remove-post.handler';
import { idParamValidator } from '../../../core/validators/param-id.validation';
import { paginationAndSortingValidation } from '../../../core/validators/pagination-and-sorting.validation';
import { PostSortFieldEnum } from '../enum/post-sort-field.enum';
import { createCommentForPostHandler } from './handlers/create-comment-for-post.handler';
import { jwtAuthGuardMiddleware } from '../../../core/middleware/jwt-auth-guard.middleware';

export const postsRouter: Router = Router();

postsRouter.get(
  '/',
  paginationAndSortingValidation(PostSortFieldEnum),
  inputValidationErrorsMiddleware,
  getAllPostsHandler,
);

postsRouter.post(
  '/',
  superAdminGuardMiddleware,
  postValidation,
  inputValidationErrorsMiddleware,
  createPostHandler,
);

postsRouter.post(
  '/:postId/comments',
  jwtAuthGuardMiddleware,
  createCommentForPostHandler,
);

postsRouter.get(
  '/:id',
  idParamValidator,
  inputValidationErrorsMiddleware,
  getPostByIdHandler,
);

postsRouter.put(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  postValidation,
  inputValidationErrorsMiddleware,
  updatePostHandler,
);

postsRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  inputValidationErrorsMiddleware,
  removePostHandler,
);
