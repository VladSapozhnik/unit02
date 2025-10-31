import { Request, Response } from 'express';
import { postsService } from '../../application/posts.service';
import { matchedData } from 'express-validator';
import { PostQueryInput } from '../input/post-query.input';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { PostSortFieldEnum } from '../../enum/post-sort-field.enum';
import { postListPaginatedOutputMapper } from '../mappers/post-list-paginated-output.mapper';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const getAllPostsHandler = async (req: Request, res: Response) => {
  try {
    const sanitizedQuery: PostQueryInput = matchedData<PostQueryInput>(req, {
      locations: ['query'],
    });

    const defaultQuery: PaginationAndSortingType<PostSortFieldEnum> =
      setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

    const { items, totalCount } = await postsService.getAllPosts(defaultQuery);

    const postsOutput = postListPaginatedOutputMapper(items, {
      pagesCount: Math.ceil(totalCount / defaultQuery.pageSize),
      pageNumber: defaultQuery.pageNumber,
      pageSize: defaultQuery.pageSize,
      totalCount,
    });

    res.json(postsOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
};
