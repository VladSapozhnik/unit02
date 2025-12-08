import { Router } from 'express';
import { blogValidation } from '../validators/blog.validation';
import { inputValidationErrorsMiddleware } from '../../../core/middleware/input-validation-errors.middleware';
import { superAdminGuardMiddleware } from '../../../core/middleware/super-admin-guard.middleware';
import { idParamValidator } from '../../../core/validators/param-id.validation';
import { paginationAndSortingValidation } from '../../../core/validators/pagination-and-sorting.validation';
import { BlogSortFieldEnum } from '../enum/blog-sort-field.enum';
import { PostSortFieldEnum } from '../../posts/enum/post-sort-field.enum';
import { blogQuerySearchValidation } from '../validators/blog-query-search.validation';
import { postWithoutBlogIdValidation } from '../../posts/validators/post-without-blogId.validation';
import { blogIdParamValidation } from '../validators/blogId-param.validation';
import { BlogsController } from './blogs.controller';
import { container } from '../../../composition-root';
import { postsController } from '../../posts/routes/posts.router';

const blogsController: BlogsController = container.get(BlogsController);

export const blogsRouter: Router = Router();

blogsRouter.get(
  '/',
  paginationAndSortingValidation(BlogSortFieldEnum),
  blogQuerySearchValidation,
  inputValidationErrorsMiddleware,
  blogsController.getAllBlogs.bind(blogsController),
);

blogsRouter.post(
  '/',
  superAdminGuardMiddleware,
  blogValidation,
  inputValidationErrorsMiddleware,
  blogsController.createBlog.bind(blogsController),
);

blogsRouter.post(
  '/:blogId/posts',
  superAdminGuardMiddleware,
  blogIdParamValidation,
  postWithoutBlogIdValidation,
  inputValidationErrorsMiddleware,
  postsController.createPostForBlog.bind(postsController),
);

blogsRouter.get(
  '/:blogId/posts',
  blogIdParamValidation,
  paginationAndSortingValidation(PostSortFieldEnum),
  inputValidationErrorsMiddleware,
  postsController.getPostsByBlogId.bind(postsController),
);

blogsRouter.get(
  '/:id',
  idParamValidator,
  inputValidationErrorsMiddleware,
  blogsController.getBlogById.bind(blogsController),
);

blogsRouter.put(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  blogValidation,
  inputValidationErrorsMiddleware,
  blogsController.updateBlog.bind(blogsController),
);

blogsRouter.delete(
  '/:id',
  superAdminGuardMiddleware,
  idParamValidator,
  inputValidationErrorsMiddleware,
  blogsController.removeBlog.bind(blogsController),
);
