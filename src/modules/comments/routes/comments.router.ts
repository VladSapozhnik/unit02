import { Router } from 'express';
import { idParamValidator } from '../../../core/validators/param-id.validation';
import { getCommentsById } from './handlers/get-comment-by-id.handler';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { commentIdParamValidation } from '../validators/commentId-param.validation';
import { removeCommentHandler } from './handlers/remove-comment.handler';
import { updateCommentHandler } from './handlers/update-comment.handler';
import { jwtAuthGuardMiddleware } from '../../../core/middleware/jwt-auth-guard.middleware';
import { commentValidation } from '../validators/comment.validation';

export const commentsRouter: Router = Router();

commentsRouter.get(
  '/:id',
  idParamValidator,
  inputValidationErrorsMiddleware,
  getCommentsById,
);

commentsRouter.put(
  '/:commentId',
  jwtAuthGuardMiddleware,
  commentIdParamValidation,
  commentValidation,
  inputValidationErrorsMiddleware,
  updateCommentHandler,
);

commentsRouter.delete(
  '/:commentId',
  jwtAuthGuardMiddleware,
  commentIdParamValidation,
  inputValidationErrorsMiddleware,
  removeCommentHandler,
);
