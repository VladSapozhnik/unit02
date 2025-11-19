import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPathConst } from '../../../../src/core/constants/router-path.const';
import { HTTP_STATUS } from '../../../../src/core/enums/http-status.enum';
import { CreateCommentDto } from '../../../../src/modules/comments/dto/create-comment.dto';
import { ObjectIdValid } from '../../blogs.e2e.spec';
import { createUserE2eUtil } from '../users/create-user.e2e.util';

const exampleCreate: CreateCommentDto = {
  content: 'stringstringstringst',
};

const exampleNotCreate: CreateCommentDto = {
  content: 'str',
};

export const jwtTokenExample: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlciIsImlhdCI6MTYwMDAwMDAsImV4cCI6MTYwMDAwMDF.INVALID_SIGNATURE';

export const createCommentE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  postId: string = ObjectIdValid,
  tokenUser: string,
): Promise<Response> => {
  let body: CreateCommentDto = exampleCreate;
  let postIdForUrl: string = postId;
  let token: string = tokenUser;

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400) {
    body = exampleNotCreate;
  }

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    postIdForUrl = ObjectIdValid;
  }

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    token = jwtTokenExample;
  }

  return await request(app)
    .post(RouterPathConst.posts + postIdForUrl + '/comments')
    .set('Authorization', `Bearer ${token}`)
    .send(body)
    .expect(statusCode);
};
