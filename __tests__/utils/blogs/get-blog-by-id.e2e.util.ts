import { Express } from 'express';
import { HTTP_STATUS } from '../../../src/core/enums/http-status';
import request from 'supertest';
import { RouterPath } from '../../../src/core/constants/router-path';
import { BlogType } from '../../../src/modules/blogs/types/blog.type';
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
