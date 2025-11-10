import { Router } from 'express';
import { idParamValidator } from '../../../core/validators/param-id.validation';
import { getCommentsById } from './handlers/get-comment-by-id.handler';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';

export const commentsRouter: Router = Router();

commentsRouter.get(
  '/:id',
  idParamValidator,
  inputValidationErrorsMiddleware,
  getCommentsById,
);
