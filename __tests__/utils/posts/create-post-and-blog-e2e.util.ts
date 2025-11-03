import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPathConst } from '../../../src/core/constants/router-path.const';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/core/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import { CreatePostDto } from '../../../src/modules/posts/dto/create-post.dto';
import { createBlogE2eUtil } from '../blogs/create-blog.e2e.util';

const exampleCreatePost: CreatePostDto = {
  title: 'Create PostType',
  shortDescription: 'Create description string',
  content: 'Content example string',
  blogId: '1',
};

const exampleNonCreatePost: CreatePostDto = {
  title: '',
  shortDescription: '',
  content: '',
  blogId: '',
};

export const createPostAndBlogE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
): Promise<Response> => {
  const responseBlog: Response = await createBlogE2eUtil(
    app,
    HTTP_STATUS.CREATED_201,
  );
  Object.assign(exampleCreatePost, { blogId: responseBlog.body.id });

  let username: string = ADMIN_USERNAME;
  let password: string = ADMIN_PASSWORD;

  let body: CreatePostDto = exampleCreatePost;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    username = 'not authorized';
    password = 'not authorized';
  }

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400) {
    body = exampleNonCreatePost;
  }

  return await request(app)
    .post(RouterPathConst.posts)
    .auth(username, password)
    .send(body)
    .expect(statusCode);
};
