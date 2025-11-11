import { Router } from 'express';
import { loginHandler } from './handlers/login.handler';
import { authValidation } from '../validators/auth.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { jwtAuthGuardMiddleware } from '../../../core/middleware/jwt-auth-guard.middleware';
import { getProfileHandler } from './handlers/get-profile.handler';

export const authRouter: Router = Router();

authRouter.post(
  '/login',
  authValidation,
  inputValidationErrorsMiddleware,
  loginHandler,
);

authRouter.get(
  '/me',
  jwtAuthGuardMiddleware,
  inputValidationErrorsMiddleware,
  getProfileHandler,
);
