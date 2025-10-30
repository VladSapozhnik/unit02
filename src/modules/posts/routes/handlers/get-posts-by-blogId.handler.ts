import type { Request, Response } from 'express';
import type { PostQueryInput } from '../input/post-query.input';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import type { PaginationAndSorting } from '../../../../core/types/pagination-and-sorting.type';
import { postsService } from '../../application/posts.service';
import { PostSortField } from '../input/post-sort-field';
import { postListPaginatedOutputMapper } from '../mappers/post-list-paginated-output.mapper';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const getPostsByBlogIdHandler = async (req: Request, res: Response) => {
  try {
    const blogId: string = req.params.id;

    const sanitizedQuery: PostQueryInput = matchedData<PostQueryInput>(req, {
      locations: ['query'],
    });

    const defaultQuery: PaginationAndSorting<PostSortField> =
      setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

    const { items, totalCount } = await postsService.getPostsByBlogId(
      blogId,
      defaultQuery,
    );

    const postsOutput = postListPaginatedOutputMapper(items, {
      pagesCount: Math.ceil(totalCount / defaultQuery.pageSize),
      pageNumber: defaultQuery.pageNumber,
      pageSize: defaultQuery.pageSize,
      totalCount,
    });

    res.send(postsOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
};
