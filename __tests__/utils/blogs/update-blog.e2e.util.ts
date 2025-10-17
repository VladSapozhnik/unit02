import { Express } from 'express';
import { Response } from 'supertest';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/enums/http-status';
import { UpdateBlogDto } from '../../../src/dto/blog/update-blog.dto';
import request from 'supertest';
import { RouterPath } from '../../../src/constants/router-path';

export const exampleUpdateBlog: UpdateBlogDto = {
  name: 'New Blog',
  description: 'New description',
  websiteUrl: 'https://www.google.com/',
};

export const exampleNonUpdateBlog: UpdateBlogDto = {
  name: '',
  description: '',
  websiteUrl: '',
};

export const updateBlogE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string | number = -100,
): Promise<Response> => {
  let username: string = ADMIN_USERNAME;
  let password: string = ADMIN_PASSWORD;
  let body: UpdateBlogDto = exampleUpdateBlog;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    username = 'not authorized';
    password = 'not authorized';
  }

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400 && id !== -100) {
    body = exampleNonUpdateBlog;
  }

  return await request(app)
    .put(RouterPath.blogs + id)
    .auth(username, password)
    .send(body)
    .expect(statusCode);
};
