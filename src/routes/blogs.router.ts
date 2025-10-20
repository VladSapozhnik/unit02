import { Router } from 'express';
import { baseBlogValidator } from '../validators/blogs/base-blog.validator';
import { inputValidationMiddleware } from '../middleware/input-validation.middleware';
import { superAdminGuardMiddleware } from '../middleware/super-admin-guard.middleware';
import { getAllBlogsController } from '../controllers/blogs/get-all.controller';
import { getBlogByIdController } from '../controllers/blogs/get-blog-by-id.controller';
import { createBlogController } from '../controllers/blogs/create-blog.controller';
import { updateBlogController } from '../controllers/blogs/update-blog.controller';
import { removeBlogController } from '../controllers/blogs/remove-blog.controller';

export const blogsRouter: Router = Router();

blogsRouter.get('/', getAllBlogsController);

blogsRouter.post(
  '/',
  superAdminGuardMiddleware,
  baseBlogValidator,
  inputValidationMiddleware,
  createBlogController,
);

blogsRouter.get('/:id', getBlogByIdController);

blogsRouter.put(
  '/:id',
  superAdminGuardMiddleware,
  baseBlogValidator,
  inputValidationMiddleware,
  updateBlogController,
);

blogsRouter.delete('/:id', superAdminGuardMiddleware, removeBlogController);
