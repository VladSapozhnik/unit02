import { Router } from 'express';
import { loginHandler } from './handlers/login.handler';
import { authValidation } from '../validators/auth.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { jwtAuthGuardMiddleware } from '../../../core/middleware/jwt-auth-guard.middleware';
import { getProfileHandler } from './handlers/get-profile.handler';
import { registerUserHandler } from './handlers/register-user.handler';
import { userValidation } from '../../users/validators/user.validation';
import { confirmEmailHandler } from './handlers/confirm-email.handler';
import { confirmEmailValidation } from '../validators/confirm-email.validation';
import { resendEmailHandler } from './handlers/resend-email.handler';
import { resendEmailValidation } from '../validators/resend-email.validation';
import { registerValidation } from '../validators/register.validation';

export const authRouter: Router = Router();

authRouter.post(
  '/login',
  authValidation,
  inputValidationErrorsMiddleware,
  loginHandler,
);

authRouter.post(
  '/registration',
  registerValidation,
  inputValidationErrorsMiddleware,
  registerUserHandler,
);

authRouter.post(
  '/registration-confirmation',
  confirmEmailValidation,
  inputValidationErrorsMiddleware,
  confirmEmailHandler,
);

authRouter.post(
  '/registration-email-resending',
  resendEmailValidation,
  inputValidationErrorsMiddleware,
  resendEmailHandler,
);

authRouter.get(
  '/me',
  jwtAuthGuardMiddleware,
  inputValidationErrorsMiddleware,
  getProfileHandler,
);
