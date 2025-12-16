import { Router } from 'express';
import { postValidation } from '../validators/post.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { idParamValidator } from '../../../core/validators/param-id.validation';
import { paginationAndSortingValidation } from '../../../core/validators/pagination-and-sorting.validation';
import { PostSortFieldEnum } from '../enums/post-sort-field.enum';
import { postIdParamValidation } from '../validators/postId-param.validation';
import { commentValidation } from '../../comments/validators/comment.validation';
import { CommentSortFieldEnum } from '../../comments/enums/comment-sort-field.enum';
import { container } from '../../../composition-root';
import { PostsController } from './posts.controller';
import { AuthGuardMiddleware } from '../../../core/middleware/jwt-auth-guard.middleware';

const authGuardMiddleware: AuthGuardMiddleware =
  container.get(AuthGuardMiddleware);

export const postsController: PostsController = container.get(PostsController);

export const postsRouter: Router = Router();

postsRouter.get(
  '/',
  paginationAndSortingValidation(PostSortFieldEnum),
  inputValidationErrorsMiddleware,
  postsController.getAllPosts.bind(postsController),
);

postsRouter.post(
  '/',
  superAdminGuardMiddleware,
  postValidation,
  inputValidationErrorsMiddleware,
  postsController.createPost.bind(postsController),
);

postsRouter.post(
  '/:postId/comments',
  authGuardMiddleware.jwtAuth.bind(authGuardMiddleware),
  postIdParamValidation,
  commentValidation,
  inputValidationErrorsMiddleware,
  postsController.createCommentForPost.bind(postsController),
);

postsRouter.get(
  '/:postId/comments',
  postIdParamValidation,
  paginationAndSortingValidation(CommentSortFieldEnum),
  inputValidationErrorsMiddleware,
  postsController.getCommentsForPostId.bind(postsController),
);

postsRouter.get(
  '/:id',
  idParamValidator,
  inputValidationErrorsMiddleware,
  postsController.getPostById.bind(postsController),
);

postsRouter.put(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  postValidation,
  inputValidationErrorsMiddleware,
  postsController.updatePost.bind(postsController),
);

postsRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  inputValidationErrorsMiddleware,
  postsController.removePost.bind(postsController),
);
