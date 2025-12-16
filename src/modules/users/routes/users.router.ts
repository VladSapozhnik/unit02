import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { userValidation } from '../validators/user.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { userQuerySearchValidation } from '../validators/user-query-search.validation';
import { paginationAndSortingValidation } from '../../../core/validators/pagination-and-sorting.validation';
import { UserSortFieldEnum } from '../enums/user-sort-field.enum';
import { idParamValidator } from '../../../core/validators/param-id.validation';
import { UsersController } from './users.controller';
import { container } from '../../../composition-root';

export const usersRouter: Router = Router();

const usersController: UsersController = container.get(UsersController);

usersRouter.get(
  '/',
  superAdminGuardMiddleware,
  paginationAndSortingValidation(UserSortFieldEnum),
  userQuerySearchValidation,
  inputValidationErrorsMiddleware,
  usersController.getUsers.bind(usersController),
);

usersRouter.post(
  '/',
  superAdminGuardMiddleware,
  userValidation,
  inputValidationErrorsMiddleware,
  usersController.createUser.bind(usersController),
);

usersRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  inputValidationErrorsMiddleware,
  usersController.removeUser.bind(usersController),
);
