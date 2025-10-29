import { Router } from 'express';
import { blogValidator } from '../validators/blog.validator';
import { inputValidationMiddleware } from '../../../core/middleware/input-validation.middleware';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { getAllBlogsHandler } from './handlers/get-all.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { removeBlogHandler } from './handlers/remove-blog.handler';
import { idParamValidator } from '../../../core/validators/param-id.validator';
import { paginationAndSortingValidation } from '../../../core/validators/pagination-and-sorting.validation';
import { BlogSortField } from './input/blog-sort-field';
import { createPostForBlogHandler } from '../../posts/routes/handlers/create-post-for-blog.handler';
import { PostSortField } from '../../posts/routes/input/post-sort-field';
import { blogIdParamValidator } from '../validators/blogId-param.validator';
import { getPostsByBlogIdHandler } from '../../posts/routes/handlers/get-posts-by-blogId.handler';

export const blogsRouter: Router = Router();

blogsRouter.get(
  '/',
  paginationAndSortingValidation(BlogSortField),
  inputValidationMiddleware,
  getAllBlogsHandler,
);

blogsRouter.post(
  '/',
  superAdminGuardMiddleware,
  blogValidator,
  inputValidationMiddleware,
  createBlogHandler,
);

blogsRouter.post(
  '/:blogId/posts',
  superAdminGuardMiddleware,
  blogIdParamValidator,
  inputValidationMiddleware,
  createPostForBlogHandler,
);

blogsRouter.get(
  '/:blogId/posts',
  paginationAndSortingValidation(PostSortField),
  blogIdParamValidator,
  inputValidationMiddleware,
  getPostsByBlogIdHandler,
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
