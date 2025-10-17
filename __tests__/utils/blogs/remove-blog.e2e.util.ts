import { Express } from 'express';
import { Response } from 'supertest';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/enums/http-status';
import request from 'supertest';
import { RouterPath } from '../../../src/constants/router-path';

export const removeBlogE2eUtil = async (
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
    .delete(RouterPath.blogs + id)
    .auth(username, password)
    .expect(statusCode);
};
