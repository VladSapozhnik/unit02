import { Express } from 'express';
import request, { Response } from 'supertest';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import { RouterPathConst } from '../../../src/core/constants/router-path.const';
import { UpdateCommentDto } from '../../../src/modules/comments/dto/update-comment.dto';
import { ObjectIdValid } from '../../blogs.e2e.spec';
import { jwtTokenExample } from './create-comment-e2e.util';

export const exampleUpdateComment: UpdateCommentDto = {
  content: 'string new update comment example',
};

export const exampleNonUpdateComment: UpdateCommentDto = {
  content: 'str',
};

export const updateCommentE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string,
  userToken: string,
): Promise<Response> => {
  let commentId: string = id;
  let token: string = userToken;
  let body: UpdateCommentDto = exampleUpdateComment;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    token = jwtTokenExample;
  }

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400) {
    body = exampleNonUpdateComment;
  }

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    commentId = ObjectIdValid;
  }

  return await request(app)
    .put(RouterPathConst.comments + commentId)
    .set('Authorization', `Bearer ${token}`)
    .send(body)
    .expect(statusCode);
};
