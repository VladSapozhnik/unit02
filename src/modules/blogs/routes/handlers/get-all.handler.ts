import { Request, Response } from 'express';
import { BlogType } from '../../types/blog.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { blogsService } from '../../application/blogs.service';
import { matchedData } from 'express-validator';
import { BlogQueryInput } from '../input/blog-query.input';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import { blogListPaginatedOutputMapper } from '../mappers/blog-list-paginated-output.mapper';
import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { BlogSortFieldEnum } from '../../enum/blog-sort-field.enum';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const getAllBlogsHandler = async (req: Request, res: Response) => {
  try {
    const sanitizedQuery: BlogQueryInput = matchedData<BlogQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const defaultQuery: PaginationAndSortingType<BlogSortFieldEnum> =
      setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

    const { items, totalCount } = await blogsService.getBlogs(defaultQuery);

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
