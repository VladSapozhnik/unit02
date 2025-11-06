import { Express } from 'express';
import { Response } from 'supertest';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/core/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import request from 'supertest';
import { RouterPathConst } from '../../../src/core/constants/router-path.const';
import { ObjectIdValid } from '../../blogs.e2e.spec';

export const removePostE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string | number = -100,
): Promise<Response> => {
  let username: string = ADMIN_USERNAME;
  let password: string = ADMIN_PASSWORD;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    username = 'not authorized';
    password = 'not authorized';
  }

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    id = ObjectIdValid;
  }

  return await request(app)
    .delete(RouterPathConst.posts + id)
    .auth(username, password)
    .expect(statusCode);
};
