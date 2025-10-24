import { Express } from 'express';
import { Response } from 'supertest';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/core/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/core/enums/http-status';
import request from 'supertest';
import { RouterPath } from '../../../src/core/constants/router-path';

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

  return await request(app)
    .delete(RouterPath.posts + id)
    .auth(username, password)
    .expect(statusCode);
};
