import { Router } from 'express';
import { blogValidation } from '../validators/blog.validation';
import { inputValidationMiddleware } from '../../../core/middleware/input-validation.middleware';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { getAllBlogsHandler } from './handlers/get-all.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { removeBlogHandler } from './handlers/remove-blog.handler';
import { idParamValidator } from '../../../core/validators/param-id.validation';
import { paginationAndSortingValidation } from '../../../core/validators/pagination-and-sorting.validation';
import { BlogSortField } from './input/blog-sort-field';
import { createPostForBlogHandler } from '../../posts/routes/handlers/create-post-for-blog.handler';
import { PostSortField } from '../../posts/routes/input/post-sort-field';
import { getPostsByBlogIdHandler } from '../../posts/routes/handlers/get-posts-by-blogId.handler';
import { blogQuerySearchValidation } from '../validators/blog-query-search.validation';
import { postWithoutBlogIdValidation } from '../../posts/validators/post-without-blogId.validation';
import { blogIdParamValidation } from '../validators/blogId-param.validation';

export const blogsRouter: Router = Router();

blogsRouter.get(
  '/',
  paginationAndSortingValidation(BlogSortField),
  blogQuerySearchValidation,
  inputValidationMiddleware,
  getAllBlogsHandler,
);

blogsRouter.post(
  '/',
  superAdminGuardMiddleware,
  blogValidation,
  inputValidationMiddleware,
  createBlogHandler,
);

blogsRouter.post(
  '/:blogId/posts',
  superAdminGuardMiddleware,
  blogIdParamValidation,
  postWithoutBlogIdValidation,
  inputValidationMiddleware,
  createPostForBlogHandler,
);

blogsRouter.get(
  '/:blogId/posts',
  blogIdParamValidation,
  paginationAndSortingValidation(PostSortField),
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
  blogValidation,
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
