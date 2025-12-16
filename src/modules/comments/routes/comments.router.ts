import { Router } from 'express';
import { idParamValidator } from '../../../core/validators/param-id.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { commentIdParamValidation } from '../validators/commentId-param.validation';
import { AuthGuardMiddleware } from '../../../core/middleware/jwt-auth-guard.middleware';
import { commentValidation } from '../validators/comment.validation';
import { container } from '../../../composition-root';
import { CommentsController } from './comments.controller';
import { likeStatusValidation } from '../validators/like-status.validation';

const authGuardMiddleware: AuthGuardMiddleware =
  container.get(AuthGuardMiddleware);

export const commentsRouter: Router = Router();

const commentsController: CommentsController =
  container.get(CommentsController);

commentsRouter.get(
  '/:id',
  idParamValidator,
  inputValidationErrorsMiddleware,
  commentsController.getCommentsById.bind(commentsController),
);

commentsRouter.put(
  '/:commentId',
  authGuardMiddleware.jwtAuth.bind(authGuardMiddleware),
  commentIdParamValidation,
  commentValidation,
  inputValidationErrorsMiddleware,
  commentsController.updateComment.bind(commentsController),
);

commentsRouter.delete(
  '/:commentId',
  authGuardMiddleware.jwtAuth.bind(authGuardMiddleware),
  commentIdParamValidation,
  inputValidationErrorsMiddleware,
  commentsController.removeComment.bind(commentsController),
);

commentsRouter.put(
  '/:commentId/like-status',
  authGuardMiddleware.jwtAuth.bind(authGuardMiddleware),
  commentIdParamValidation,
  likeStatusValidation,
  inputValidationErrorsMiddleware,
  commentsController.updateCommentLikeStatus.bind(commentsController),
);
