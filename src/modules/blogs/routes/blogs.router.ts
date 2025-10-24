import { Router } from 'express';
import { blogValidator } from '../validators/blog.validator';
import { inputValidationMiddleware } from '../../../core/middleware/input-validation.middleware';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { getAllBlogsController } from './handlers/get-all.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { removeBlogHandler } from './handlers/remove-blog.handler';
import { idParamValidator } from '../../../core/validators/param-id.validator';

export const blogsRouter: Router = Router();

blogsRouter.get('/', getAllBlogsController);

blogsRouter.post(
  '/',
  superAdminGuardMiddleware,
  blogValidator,
  inputValidationMiddleware,
  createBlogHandler,
);

blogsRouter.get(
  '/:id',
  idParamValidator,
  inputValidationMiddleware,
  getBlogByIdHandler,
);

blogsRouter.put(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  blogValidator,
  inputValidationMiddleware,
  updateBlogHandler,
);

blogsRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  inputValidationMiddleware,
  removeBlogHandler,
);
