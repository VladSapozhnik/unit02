import { Express } from 'express';
import { HTTP_STATUS } from '../../../../src/core/enums/http-status.enum';
import request from 'supertest';
import { RouterPathConst } from '../../../../src/core/constants/router-path.const';
import { Response } from 'supertest';
import { PostsDocument } from '../../../../src/modules/posts/entities/post.entity';

export const getPostByIdE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string | number = -100,
  blog: PostsDocument | {},
): Promise<Response> => {
  let findBlog: PostsDocument | {} = blog;

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    return await request(app)
      .get(RouterPathConst.posts + id)
      .expect(statusCode);
  }

  return await request(app)
    .get(RouterPathConst.posts + id)
    .expect(statusCode, findBlog);
};
