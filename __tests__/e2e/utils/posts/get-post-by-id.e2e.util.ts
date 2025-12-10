import { Express } from 'express';
import { HTTP_STATUS } from '../../../../src/core/enums/http-status.enum';
import request from 'supertest';
import { RouterPathConst } from '../../../../src/core/constants/router-path.const';
import { Response } from 'supertest';
import { PostDBType } from '../../../../src/modules/posts/types/post.type';

export const getPostByIdE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string | number = -100,
  blog: PostDBType | {},
): Promise<Response> => {
  let findBlog: PostDBType | {} = blog;

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    return await request(app)
      .get(RouterPathConst.posts + id)
      .expect(statusCode);
  }

  return await request(app)
    .get(RouterPathConst.posts + id)
    .expect(statusCode, findBlog);
};
