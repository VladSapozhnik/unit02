import { Express } from 'express';
import { HTTP_STATUS } from '../../../src/enums/http-status';
import request from 'supertest';
import { RouterPath } from '../../../src/constants/router-path';
import { Response } from 'supertest';
import { ResponsePostDto } from '../../../src/dto/post/response-post.dto';

export const getPostByIdE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string | number = -100,
  blog: ResponsePostDto | {},
): Promise<Response> => {
  let findBlog: ResponsePostDto | {} = blog;

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    findBlog = {};
  }

  return await request(app)
    .get(RouterPath.posts + id)
    .expect(statusCode, findBlog);
};
