import { Express } from 'express';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import request from 'supertest';
import { RouterPathConst } from '../../../src/core/constants/router-path.const';
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
    return await request(app)
      .get(RouterPathConst.blogs + id)
      .expect(statusCode);
  }

  return await request(app)
    .get(RouterPathConst.blogs + id)
    .expect(statusCode, findBlog);
};
