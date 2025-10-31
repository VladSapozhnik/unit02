import { Router } from 'express';
import { blogValidation } from '../validators/blog.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { getAllBlogsHandler } from './handlers/get-all.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { removeBlogHandler } from './handlers/remove-blog.handler';
import { idParamValidator } from '../../../core/validators/param-id.validation';
import { paginationAndSortingValidation } from '../../../core/validators/pagination-and-sorting.validation';
import { BlogSortFieldEnum } from '../enum/blog-sort-field.enum';
import { createPostForBlogHandler } from '../../posts/routes/handlers/create-post-for-blog.handler';
import { PostSortFieldEnum } from '../../posts/enum/post-sort-field.enum';
import { getPostsByBlogIdHandler } from '../../posts/routes/handlers/get-posts-by-blogId.handler';
import { blogQuerySearchValidation } from '../validators/blog-query-search.validation';
import { postWithoutBlogIdValidation } from '../../posts/validators/post-without-blogId.validation';
import { blogIdParamValidation } from '../../../core/validators/blogId-param.validation';

export const blogsRouter: Router = Router();

blogsRouter.get(
  '/',
  paginationAndSortingValidation(BlogSortFieldEnum),
  blogQuerySearchValidation,
  inputValidationErrorsMiddleware,
  getAllBlogsHandler,
);

blogsRouter.post(
  '/',
  superAdminGuardMiddleware,
  blogValidation,
  inputValidationErrorsMiddleware,
  createBlogHandler,
);

blogsRouter.post(
  '/:blogId/posts',
  superAdminGuardMiddleware,
  blogIdParamValidation,
  postWithoutBlogIdValidation,
  inputValidationErrorsMiddleware,
  createPostForBlogHandler,
);

blogsRouter.get(
  '/:blogId/posts',
  blogIdParamValidation,
  paginationAndSortingValidation(PostSortFieldEnum),
  inputValidationErrorsMiddleware,
  getPostsByBlogIdHandler,
);

blogsRouter.get(
  '/:id',
  idParamValidator,
  inputValidationErrorsMiddleware,
  getBlogByIdHandler,
);

blogsRouter.put(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  blogValidation,
  inputValidationErrorsMiddleware,
  updateBlogHandler,
);

blogsRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  inputValidationErrorsMiddleware,
  removeBlogHandler,
);
