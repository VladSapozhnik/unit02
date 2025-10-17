import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPath } from '../../../src/constants/router-path';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/enums/http-status';
import { CreatePostDto } from '../../../src/dto/post/create-post.dto';

const exampleCreatePost: CreatePostDto = {
  title: 'Create Post',
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

export const createPostE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
): Promise<Response> => {
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
    .post(RouterPath.posts)
    .auth(username, password)
    .send(body)
    .expect(statusCode);
};
