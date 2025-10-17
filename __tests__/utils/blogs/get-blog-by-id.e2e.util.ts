import { Express } from 'express';
import { HTTP_STATUS } from '../../../src/enums/http-status';
import request from 'supertest';
import { RouterPath } from '../../../src/constants/router-path';
import { ResponseBlogDto } from '../../../src/dto/blog/response-blog.dto';
import { Response } from 'supertest';

export const getBlogByIdE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string | number,
  blog: ResponseBlogDto | {} = {},
): Promise<Response> => {
  let findBlog: ResponseBlogDto | {} = blog;

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    findBlog = {};
  }

  return await request(app)
    .get(RouterPath.blogs + id)
    .expect(statusCode, findBlog);
};
