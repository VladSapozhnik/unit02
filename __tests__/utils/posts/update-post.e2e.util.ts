import { Express } from 'express';
import request, { Response } from 'supertest';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/core/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import { RouterPath } from '../../../src/core/constants/router-path';
import { CreatePostDto } from '../../../src/modules/posts/dto/create-post.dto';
import { UpdatePostDto } from '../../../src/modules/posts/dto/update-post.dto';

export const exampleUpdatePost: CreatePostDto = {
  title: 'new string',
  shortDescription: 'new string',
  content: 'new string',
  blogId: '1',
};

export const exampleNonUpdatePost: UpdatePostDto = {
  title: '',
  shortDescription: '',
  content: '',
  blogId: '',
};

export const updatePostE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string | number,
  blogId: string | number,
): Promise<Response> => {
  let username: string = ADMIN_USERNAME;
  let password: string = ADMIN_PASSWORD;
  let body: UpdatePostDto = exampleUpdatePost;

  if (blogId !== -100) {
    Object.assign(body, { blogId: blogId });
  }

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    username = 'not authorized';
    password = 'not authorized';
  }

  if (
    statusCode === HTTP_STATUS.BAD_REQUEST_400 &&
    id !== -100 &&
    blogId !== -100
  ) {
    body = exampleNonUpdatePost;
  }

  return await request(app)
    .put(RouterPath.posts + id)
    .auth(username, password)
    .send(body)
    .expect(statusCode);
};
