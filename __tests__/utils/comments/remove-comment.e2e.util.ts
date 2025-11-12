import { Express } from 'express';
import request, { Response } from 'supertest';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import { RouterPathConst } from '../../../src/core/constants/router-path.const';
import { ObjectIdValid } from '../../blogs.e2e.spec';
import { jwtTokenExample } from './create-comment-e2e.util';

export const removeCommentE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string,
  userToken: string,
): Promise<Response> => {
  let commentId: string = id;
  let token: string = userToken;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    token = jwtTokenExample;
  }

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    commentId = ObjectIdValid;
  }

  return await request(app)
    .delete(RouterPathConst.comments + commentId)
    .set('Authorization', `Bearer ${token}`)
    .expect(statusCode);
};
