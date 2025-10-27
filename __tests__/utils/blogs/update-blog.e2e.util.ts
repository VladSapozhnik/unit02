import { Express } from 'express';
import { Response } from 'supertest';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/core/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import { UpdateBlogDto } from '../../../src/modules/blogs/dto/update-blog.dto';
import request from 'supertest';
import { RouterPath } from '../../../src/core/constants/router-path';
import { ObjectIdValid } from '../../blogs.e2e.spec';

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
  id: string | number = ObjectIdValid,
): Promise<Response> => {
  let username: string = ADMIN_USERNAME;
  let password: string = ADMIN_PASSWORD;
  let body: UpdateBlogDto = exampleUpdateBlog;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    username = 'not authorized';
    password = 'not authorized';
  }

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400 && id !== ObjectIdValid) {
    body = exampleNonUpdateBlog;
  }

  return await request(app)
    .put(RouterPath.blogs + id)
    .auth(username, password)
    .send(body)
    .expect(statusCode);
};
