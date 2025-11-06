import { Express } from 'express';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import request from 'supertest';
import { RouterPathConst } from '../../../src/core/constants/router-path.const';
import { Response } from 'supertest';
import { UserType } from '../../../src/modules/users/type/user.type';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/core/middleware/super-admin-guard.middleware';
import { SortDirectionEnum } from '../../../src/core/enums/sort-direction.enum';
import { UserSortFieldEnum } from '../../../src/modules/users/enum/user-sort-field.enum';
import { UserQueryInput } from '../../../src/modules/users/routes/input/user-query.input';

const paginationInputDefault: UserQueryInput = {
  sortBy: UserSortFieldEnum.CreatedAt,
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

const paginationAndSearchInputDefault: UserQueryInput = {
  searchLoginTerm: 'PBvS',
  searchEmailTerm: 'gmail',
  sortBy: UserSortFieldEnum.CreatedAt,
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

export const getUsersE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  user: UserType | null = null,
  isSearchInPagination: boolean = false,
): Promise<Response> => {
  let username: string = ADMIN_USERNAME;
  let password: string = ADMIN_PASSWORD;
  let paginationInput: UserQueryInput = paginationInputDefault;
  let paginationOutput = paginationOutputDefault;
  let items: UserType[] = user ? [user] : [];

  if (isSearchInPagination && HTTP_STATUS.OK_200) {
    paginationInput = paginationAndSearchInputDefault;
    paginationOutput = paginationAndSearchOutputDefault;
  }

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    username = 'not authorized';
    password = 'not authorized';

    return await request(app)
      .get(RouterPathConst.users)
      .query(paginationInput)
      .auth(username, password)
      .expect(statusCode);
  }

  if (items.length === 0) {
    paginationOutput = {
      ...paginationOutput,
      pagesCount: 0,
      totalCount: 0,
    };
  }

  return await request(app)
    .get(RouterPathConst.users)
    .query(paginationInput)
    .auth(username, password)
    .expect(statusCode, { ...paginationOutput, items });
};
