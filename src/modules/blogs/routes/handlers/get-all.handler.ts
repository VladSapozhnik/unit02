import { Request, Response } from 'express';
import { BlogType } from '../../types/blog.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { blogsService } from '../../application/blogs.service';
import { matchedData } from 'express-validator';
import { BlogQueryInput } from '../input/blog-query.input';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import { blogListPaginatedOutputMapper } from '../mappers/blog-list-paginated-output.mapper';
import { PaginationAndSorting } from '../../../../core/types/pagination-and-sorting.type';
import { BlogSortField } from '../input/blog-sort-field';
import { PaginatedOutputType } from '../../../../core/types/paginated-output.type';

export const getAllBlogsHandler = async (req: Request, res: Response) => {
  try {
    const sanitizedQuery: BlogQueryInput = matchedData<BlogQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const defaultQuery: PaginationAndSorting<BlogSortField> =
      setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

    const { items, totalCount } = await blogsService.getBlogs(defaultQuery);

    const blogsOutput: PaginatedOutputType<BlogType> =
      blogListPaginatedOutputMapper(items, {
        pagesCount: Math.ceil(totalCount / defaultQuery.pageSize),
        page: defaultQuery.page,
        pageSize: defaultQuery.pageSize,
        totalCount,
      });

    res.send(blogsOutput);
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
