import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { BlogQueryInput } from '../input/blog-query.input';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import { blogListPaginatedOutputMapper } from '../mappers/blog-list-paginated-output.mapper';
import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { BlogSortFieldEnum } from '../../enum/blog-sort-field.enum';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';

export const getAllBlogsHandler = async (req: Request, res: Response) => {
  try {
    const sanitizedQuery: BlogQueryInput = matchedData<BlogQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const defaultQuery: PaginationAndSortingType<BlogSortFieldEnum> =
      setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

    const { items, totalCount } =
      await blogsQueryRepository.getBlogs(defaultQuery);

    const blogsOutput = blogListPaginatedOutputMapper(items, {
      pagesCount: Math.ceil(totalCount / defaultQuery.pageSize),
      pageNumber: defaultQuery.pageNumber,
      pageSize: defaultQuery.pageSize,
      totalCount,
    });

    res.send(blogsOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
};
