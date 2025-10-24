import { Express } from 'express';
import { HTTP_STATUS } from '../../../src/core/enums/http-status';
import request from 'supertest';
import { RouterPath } from '../../../src/core/constants/router-path';
import { Response } from 'supertest';
import { PostType } from '../../../src/modules/posts/types/post.type';

export const getPostByIdE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string | number = -100,
  blog: PostType | {},
): Promise<Response> => {
  let findBlog: PostType | {} = blog;

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    findBlog = {};
  }

  return await request(app)
    .get(RouterPath.posts + id)
    .expect(statusCode, findBlog);
};
