import type { Request, Response } from 'express';
import type { PostQueryInput } from '../input/post-query.input';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import type { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { PostSortFieldEnum } from '../../enum/post-sort-field.enum';
import { blogsQueryRepository } from '../../../blogs/repositories/blogs.query.repository';
import { BlogType } from '../../../blogs/types/blog.type';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';
import { postsQueryRepository } from '../../repositories/posts.query.repository';

export const getPostsByBlogIdHandler = async (req: Request, res: Response) => {
  const blogId: string = req.params.blogId;

  const sanitizedQuery: PostQueryInput = matchedData<PostQueryInput>(req, {
    locations: ['query'],
  });

  const defaultQuery: PaginationAndSortingType<PostSortFieldEnum> =
    setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

  const existBlog: BlogType | null =
    await blogsQueryRepository.getBlogById(blogId);

  if (!existBlog) {
    throw new NotFoundError('Blog not found for post', 'BlogId for Post');
  }

  const postsOutput = await postsQueryRepository.getPosts(defaultQuery, blogId);

  res.send(postsOutput);
};
