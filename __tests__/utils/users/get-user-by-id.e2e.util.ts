import { Express } from 'express';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import request from 'supertest';
import { RouterPathConst } from '../../../src/core/constants/router-path.const';
import { Response } from 'supertest';
import { UserType } from '../../../src/modules/users/type/user.type';

export const getUserByIdE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string | number,
  user: UserType | {} = {},
): Promise<Response> => {
  let findUser: UserType | {} = user;

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    return await request(app)
      .get(RouterPathConst.users + id)
      .expect(statusCode);
  }

  return await request(app)
    .get(RouterPathConst.users + id)
    .expect(statusCode, findUser);
};
