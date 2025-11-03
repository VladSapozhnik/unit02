import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPathConst } from '../../../src/core/constants/router-path.const';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/core/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import { CreateBlogDto } from '../../../src/modules/blogs/dto/create-blog.dto';

export const exampleCreateBlog = {
  name: 'Test Name',
  description: 'Description',
  websiteUrl:
    'https://9.bnkqAJalm18cU8rsHdEqoUmUT2xh8Eb0h2a35xQiRR-UslhXAolExHnl.wKoraGI.HDtXk1.hZnv_1p4WqL5_Quj6f',
};

export const exampleNonCreateBlog = {
  name: '',
  description: '',
  websiteUrl: '',
};

export const createBlogE2eUtil = async (
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
    .post(RouterPathConst.blogs)
    .auth(username, password)
    .send(body)
    .expect(statusCode);
};
