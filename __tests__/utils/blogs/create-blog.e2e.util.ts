import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPath } from '../../../src/constants/router-path';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/enums/http-status';
import { CreateBlogDto } from '../../../src/dto/blog/create-blog.dto';

export const exampleCreateBlog: CreateBlogDto = {
  name: 'Name',
  description: 'Description',
  websiteUrl:
    'https://9.bnkqAJalm18cU8rsHdEqoUmUT2xh8Eb0h2a35xQiRR-UslhXAolExHnl.wKoraGI.HDtXk1.hZnv_1p4WqL5_Quj6f',
};

export const exampleNonCreateBlog: CreateBlogDto = {
  name: '',
  description: '',
  websiteUrl: '',
};

export const createBlogE2e = async (
  app: Express,
  statusCode: HTTP_STATUS,
): Promise<Response> => {
  let username: string = ADMIN_USERNAME;
  let password: string = ADMIN_PASSWORD;
  let body: CreateBlogDto = exampleCreateBlog;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    username = 'not authorized';
    password = 'not authorized';
  }

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400) {
    body = exampleNonCreateBlog;
  }

  return await request(app)
    .post(RouterPath.blogs)
    .auth(username, password)
    .send(body)
    .expect(statusCode);
};
