import { Router } from 'express';
import { createUserHandler } from './handlers/create-user.handler';
import { getUsersHandler } from './handlers/get-users.handler';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { userValidation } from '../validators/user.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { userQuerySearchValidation } from '../validators/user-query-search.validation';
import { paginationAndSortingValidation } from '../../../core/validators/pagination-and-sorting.validation';
import { UserSortFieldEnum } from '../enum/user-sort-field.enum';
import { removeUserHandler } from './handlers/remove-user.handler';
import { idParamValidator } from '../../../core/validators/param-id.validation';

export const usersRouter: Router = Router();

usersRouter.get(
  '/',
  superAdminGuardMiddleware,
  paginationAndSortingValidation(UserSortFieldEnum),
  userQuerySearchValidation,
  inputValidationErrorsMiddleware,
  getUsersHandler,
);

usersRouter.post(
  '/',
  superAdminGuardMiddleware,
  userValidation,
  inputValidationErrorsMiddleware,
  createUserHandler,
);

usersRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  inputValidationErrorsMiddleware,
  removeUserHandler,
);
