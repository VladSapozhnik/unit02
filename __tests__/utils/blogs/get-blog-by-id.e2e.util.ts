import { Express } from 'express';
import { HTTP_STATUS } from '../../../src/enums/http-status';
import request from 'supertest';
import { RouterPath } from '../../../src/constants/router-path';
import { BlogType } from '../../../src/types/blog.type';
import { Response } from 'supertest';

export const getBlogByIdE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string | number,
  blog: BlogType | {} = {},
): Promise<Response> => {
  let findBlog: BlogType | {} = blog;

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    findBlog = {};
  }

  return await request(app)
    .get(RouterPath.blogs + id)
    .expect(statusCode, findBlog);
};
