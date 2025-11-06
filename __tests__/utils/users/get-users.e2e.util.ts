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

let paginationDefault: UserQueryInput = {
  sortBy: UserSortFieldEnum.CreatedAt,
  sortDirection: SortDirectionEnum.Asc,
  pageSize: 2,
  pageNumber: 1,
};

let paginationOutput = {
  pagesCount: 1,
  page: paginationDefault.pageNumber,
  pageSize: paginationDefault.pageSize,
  totalCount: 1,
};

export const getUsersE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  user: UserType | {} = {},
): Promise<Response> => {
  let findUser: UserType | {} = user;
  let username: string = ADMIN_USERNAME;
  let password: string = ADMIN_PASSWORD;

  // if (isSearchInPagination) {
  //   paginationDefault = {
  //     ...paginationDefault,
  //     pageNumber: 1,
  //   };
  //
  //   paginationOutput = {
  //     ...paginationOutput,
  //     page: paginationDefault.pageNumber,
  //     totalCount: 2,
  //     pagesCount: 2,
  //   };
  // }

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    username = 'not authorized';
    password = 'not authorized';

    return await request(app)
      .get(RouterPathConst.users)
      .query(paginationDefault)
      .auth(username, password)
      .expect(statusCode);
  }

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    return await request(app)
      .get(RouterPathConst.users)
      .query(paginationDefault)
      .auth(username, password)
      .expect(HTTP_STATUS.OK_200, {
        ...paginationOutput,
        pagesCount: 0,
        totalCount: 0,
        items: [],
      });
  }

  return await request(app)
    .get(RouterPathConst.users)
    .query(paginationDefault)
    .auth(username, password)
    .expect(statusCode, { ...paginationOutput, items: [findUser] });
};
