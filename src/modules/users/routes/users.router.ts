import { Router } from 'express';
import { createUserHandler } from './handlers/create-user.handler';
import { getUsersHandler } from './handlers/get-users.handler';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { userValidation } from '../validators/user.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';

export const usersRouter: Router = Router();

usersRouter.get('/', superAdminGuardMiddleware, getUsersHandler);

usersRouter.post(
  '/',
  superAdminGuardMiddleware,
  userValidation,
  inputValidationErrorsMiddleware,
  createUserHandler,
);
