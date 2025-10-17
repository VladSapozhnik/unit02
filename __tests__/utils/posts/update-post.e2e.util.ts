import { Express } from 'express';
import { Response } from 'supertest';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/enums/http-status';
import request from 'supertest';
import { RouterPath } from '../../../src/constants/router-path';
import { CreatePostDto } from '../../../src/dto/post/create-post.dto';
import { UpdatePostDto } from '../../../src/dto/post/update-post.dto';

export const exampleUpdatePost: CreatePostDto = {
  title: 'string',
  shortDescription: 'string',
  content: 'string',
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
  id: string | number = -100,
): Promise<Response> => {
  let username: string = ADMIN_USERNAME;
  let password: string = ADMIN_PASSWORD;
  let body: UpdatePostDto = exampleUpdatePost;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    username = 'not authorized';
    password = 'not authorized';
  }

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400 && id !== -100) {
    body = exampleNonUpdatePost;
  }

  return await request(app)
    .put(RouterPath.posts + id)
    .auth(username, password)
    .send(body)
    .expect(statusCode);
};
