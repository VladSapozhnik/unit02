import type { Request, Response } from 'express';
import { PostQueryInput } from '../input/post-query.input';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import { PaginationAndSorting } from '../../../../core/types/pagination-and-sorting.type';
import { postsService } from '../../application/posts.service';
import { PostSortField } from '../input/post-sort-field';
import { ResultAndTotalCountType } from '../../../../core/types/result-and-total-count.type';
import { postListPaginatedOutputMapper } from '../mappers/post-list-paginated-output.mapper';
import { PaginatedOutputType } from '../../../../core/types/paginated-output.type';
import { PostType } from '../../types/post.type';

export const getPostsByBlogIdHandler = async (req: Request, res: Response) => {
  const blogId: string = req.params.blogId;

  const sanitizedQuery: PostQueryInput = matchedData<PostQueryInput>(req, {
    locations: ['query'],
  });

  const defaultQuery: PaginationAndSorting<PostSortField> =
    setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

  const { items, totalCount } = await postsService.getPostsByBlogId(
    blogId,
    defaultQuery,
  );

  const postsOutput: PaginatedOutputType<PostType> =
    postListPaginatedOutputMapper(items, {
      pagesCount: Math.ceil(totalCount / defaultQuery.pageSize),
      page: defaultQuery.page,
      pageSize: defaultQuery.pageSize,
      totalCount,
    });

  res.send(postsOutput);
};
