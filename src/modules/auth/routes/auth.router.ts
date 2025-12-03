import { Router } from 'express';
import { loginHandler } from './handlers/login.handler';
import { authValidation } from '../validators/auth.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { jwtAuthGuardMiddleware } from '../../../core/middleware/jwt-auth-guard.middleware';
import { getProfileHandler } from './handlers/get-profile.handler';
import { registerUserHandler } from './handlers/register-user.handler';
import { confirmEmailHandler } from './handlers/confirm-email.handler';
import { confirmEmailValidation } from '../validators/confirm-email.validation';
import { resendEmailHandler } from './handlers/resend-email.handler';
import { resendEmailValidation } from '../validators/resend-email.validation';
import { registerValidation } from '../validators/register.validation';
import { logoutHandler } from './handlers/logout.handler';
import { refreshTokenHandler } from './handlers/refresh-token.handler';
import { rateLimitMiddleware } from '../../../core/middleware/rate-limit.middleware';

export const authRouter: Router = Router();

authRouter.post(
  '/login',
  authValidation,
  inputValidationErrorsMiddleware,
  rateLimitMiddleware,
  loginHandler,
);

authRouter.post('/logout', logoutHandler);

authRouter.post('/refresh-token', refreshTokenHandler);

authRouter.post(
  '/registration',
  registerValidation,
  inputValidationErrorsMiddleware,
  rateLimitMiddleware,
  registerUserHandler,
);

authRouter.post(
  '/registration-confirmation',
  confirmEmailValidation,
  inputValidationErrorsMiddleware,
  rateLimitMiddleware,
  confirmEmailHandler,
);

authRouter.post(
  '/registration-email-resending',
  resendEmailValidation,
  inputValidationErrorsMiddleware,
  rateLimitMiddleware,
  resendEmailHandler,
);

authRouter.get(
  '/me',
  jwtAuthGuardMiddleware,
  inputValidationErrorsMiddleware,
  getProfileHandler,
);
