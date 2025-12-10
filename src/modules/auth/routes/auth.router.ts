import { Router } from 'express';
import { authValidation } from '../validators/auth.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { confirmEmailValidation } from '../validators/confirm-email.validation';
import { resendEmailValidation } from '../validators/resend-email.validation';
import { registerValidation } from '../validators/register.validation';
import { AuthController } from './auth.controller';
import { container } from '../../../composition-root';
import { AuthGuardMiddleware } from '../../../core/middleware/jwt-auth-guard.middleware';
import { RateLimitMiddleware } from '../../../core/middleware/rate-limit.middleware';
import { passwordRecoveryValidation } from '../validators/password-recovery.validation';
import { newPasswordValidation } from '../validators/new-password.validation';

const authGuardMiddleware: AuthGuardMiddleware =
  container.get(AuthGuardMiddleware);

const rateLimitMiddleware: RateLimitMiddleware =
  container.get(RateLimitMiddleware);

export const authRouter: Router = Router();

const authController: AuthController = container.get(AuthController);

authRouter.post(
  '/login',
  authValidation,
  inputValidationErrorsMiddleware,
  rateLimitMiddleware.check.bind(rateLimitMiddleware),
  authController.login.bind(authController),
);

authRouter.post('/logout', authController.logout.bind(authController));

authRouter.post(
  '/refresh-token',
  authController.refreshToken.bind(authController),
);

authRouter.post(
  '/registration',
  registerValidation,
  inputValidationErrorsMiddleware,
  rateLimitMiddleware.check.bind(rateLimitMiddleware),
  authController.registerUser.bind(authController),
);

authRouter.post(
  '/registration-confirmation',
  confirmEmailValidation,
  inputValidationErrorsMiddleware,
  rateLimitMiddleware.check.bind(rateLimitMiddleware),
  authController.confirmEmail.bind(authController),
);

authRouter.post(
  '/registration-email-resending',
  resendEmailValidation,
  rateLimitMiddleware.check.bind(rateLimitMiddleware),
  inputValidationErrorsMiddleware,
  authController.resendEmail.bind(authController),
);

authRouter.get(
  '/me',
  authGuardMiddleware.jwtAuth.bind(authGuardMiddleware),
  inputValidationErrorsMiddleware,
  authController.getProfile.bind(authController),
);

authRouter.post(
  '/password-recovery',
  passwordRecoveryValidation,
  inputValidationErrorsMiddleware,
  rateLimitMiddleware.check.bind(rateLimitMiddleware),
  authController.passwordRecovery.bind(authController),
);

authRouter.post(
  '/new-password',
  newPasswordValidation,
  inputValidationErrorsMiddleware,
  rateLimitMiddleware.check.bind(rateLimitMiddleware),
  authController.newPassword.bind(authController),
);
