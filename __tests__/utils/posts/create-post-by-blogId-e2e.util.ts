import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPath } from '../../../src/core/constants/router-path';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/core/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import { CreatePostForBlogDto } from '../../../src/modules/posts/dto/create-post.dto';
import { createBlogE2eUtil } from '../blogs/create-blog.e2e.util';
import { ObjectIdValid } from '../../blogs.e2e.spec';

const exampleCreatePost: CreatePostForBlogDto = {
  title: 'Create PostType',
  shortDescription: 'Create description string',
  content: 'Content example string',
};

const exampleNonCreatePost: CreatePostForBlogDto = {
  title: '',
  shortDescription: '',
  content: '',
};

export const createPostForBlogE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
): Promise<Response> => {
  let blogId: string | null = null;
  const responseBlog: Response = await createBlogE2eUtil(
    app,
    HTTP_STATUS.CREATED_201,
  );
  let username: string = ADMIN_USERNAME;
  let password: string = ADMIN_PASSWORD;

  let body: CreatePostForBlogDto = exampleCreatePost;

  if (statusCode === HTTP_STATUS.CREATED_201) {
    blogId = responseBlog.body.id;
  }

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400) {
    body = exampleNonCreatePost;
  }

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    username = 'not authorized';
    password = 'not authorized';
  }

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    blogId = ObjectIdValid;
  }

  return await request(app)
    .post(`${RouterPath.blogs + blogId + RouterPath.posts}`)
    .auth(username, password)
    .send(body)
    .expect(statusCode);
};
