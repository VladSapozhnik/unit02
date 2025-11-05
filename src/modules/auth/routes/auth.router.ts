import { Router } from 'express';
import { loginHandler } from './handlers/login.handler';
import { authValidation } from '../validators/auth.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';

export const authRouter: Router = Router();

authRouter.post(
  '/login',
  authValidation,
  inputValidationErrorsMiddleware,
  loginHandler,
);
