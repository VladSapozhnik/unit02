import { Express } from 'express';
import { HTTP_STATUS } from '../../../../src/core/enums/http-status.enum';
import request, { Response } from 'supertest';
import { RouterPathConst } from '../../../../src/core/constants/router-path.const';
import { SortDirectionEnum } from '../../../../src/core/enums/sort-direction.enum';
import { CommentQueryInput } from '../../../../src/modules/comments/routes/input/comment-query.input';
import { CommentSortFieldEnum } from '../../../../src/modules/comments/enum/comment-sort-field.enum';
import { CommentType } from '../../../../src/modules/comments/types/comment.type';
import { ObjectIdValid } from '../../blogs.e2e.spec';

const paginationInputDefault: CommentQueryInput = {
  sortBy: CommentSortFieldEnum.CreatedAt,
  sortDirection: SortDirectionEnum.Asc,
  pageSize: 2,
  pageNumber: 1,
};

const paginationOutputDefault = {
  pagesCount: 1,
  page: paginationInputDefault.pageNumber,
  pageSize: paginationInputDefault.pageSize,
  totalCount: 1,
};

const paginationAndSearchInputDefault: CommentQueryInput = {
  sortBy: CommentSortFieldEnum.CreatedAt,
  sortDirection: SortDirectionEnum.Asc,
  pageSize: 1,
  pageNumber: 2,
};

const paginationAndSearchOutputDefault = {
  pagesCount: 2,
  page: paginationAndSearchInputDefault.pageNumber,
  pageSize: paginationAndSearchInputDefault.pageSize,
  totalCount: 2,
};

export const getCommentsForPostE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  comments: CommentType | null = null,
  postId: string = ObjectIdValid,
  isSearchInPagination: boolean = false,
): Promise<Response> => {
  let paginationInput: CommentQueryInput = paginationInputDefault;
  let paginationOutput = paginationOutputDefault;
  let items: CommentType[] = comments ? [comments] : [];

  if (isSearchInPagination && HTTP_STATUS.OK_200) {
    paginationInput = paginationAndSearchInputDefault;
    paginationOutput = paginationAndSearchOutputDefault;
  }

  if (items.length === 0) {
    paginationOutput = {
      ...paginationOutput,
      pagesCount: 0,
      totalCount: 0,
    };
  }

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    return await request(app)
      .get(RouterPathConst.posts + ObjectIdValid + '/comments')
      .query(paginationInput)
      .expect(statusCode);
  }

  return await request(app)
    .get(RouterPathConst.posts + postId + '/comments')
    .query(paginationInput)
    .expect(statusCode, { ...paginationOutput, items });
};
