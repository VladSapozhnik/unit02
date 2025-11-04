import type { Request, Response } from 'express';
import type { PostQueryInput } from '../input/post-query.input';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import type { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { postsService } from '../../application/posts.service';
import { PostSortFieldEnum } from '../../enum/post-sort-field.enum';
import { postListPaginatedOutputMapper } from '../mappers/post-list-paginated-output.mapper';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { paginatedListMapper } from '../../../../core/mappers/paginated-list.mapper';
import { PostType } from '../../types/post.type';
import { postMapper } from '../mappers/posts.mapper';

export const getPostsByBlogIdHandler = async (req: Request, res: Response) => {
  try {
    const blogId: string = req.params.blogId;

    const sanitizedQuery: PostQueryInput = matchedData<PostQueryInput>(req, {
      locations: ['query'],
    });

    const defaultQuery: PaginationAndSortingType<PostSortFieldEnum> =
      setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

    const { items, totalCount } = await postsService.getPostsByBlogId(
      blogId,
      defaultQuery,
    );

    const postsOutput = paginatedListMapper<PostType>(
      items,
      {
        pagesCount: Math.ceil(totalCount / defaultQuery.pageSize),
        pageNumber: defaultQuery.pageNumber,
        pageSize: defaultQuery.pageSize,
        totalCount,
      },
      postMapper,
    );

    res.send(postsOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
};
