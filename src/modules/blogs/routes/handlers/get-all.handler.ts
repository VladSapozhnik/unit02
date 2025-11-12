import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { BlogQueryInput } from '../input/blog-query.input';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { BlogSortFieldEnum } from '../../enum/blog-sort-field.enum';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';

export const getAllBlogsHandler = async (req: Request, res: Response) => {
  const sanitizedQuery: BlogQueryInput = matchedData<BlogQueryInput>(req, {
    locations: ['query'],
    includeOptionals: true,
  });

  const defaultQuery: PaginationAndSortingType<BlogSortFieldEnum> =
    setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

  const blogsOutput = await blogsQueryRepository.getBlogs(defaultQuery);

  res.send(blogsOutput);
};
