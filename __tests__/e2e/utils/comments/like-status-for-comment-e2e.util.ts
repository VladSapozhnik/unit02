import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPathConst } from '../../../../src/core/constants/router-path.const';
import { HTTP_STATUS } from '../../../../src/core/enums/http-status.enum';
import { ObjectIdValid } from '../../blogs.e2e.spec';
import { LikeStatusEnum } from '../../../../src/modules/likes/enums/like-status.enum';

const exampleLikeStatus: { likeStatus: string } = {
  likeStatus: LikeStatusEnum.Like,
};

const exampleNotLikeStatus: { likeStatus: string } = {
  likeStatus: 'unlike',
};

export const jwtTokenExample: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlciIsImlhdCI6MTYwMDAwMDAsImV4cCI6MTYwMDAwMDF.INVALID_SIGNATURE';

export const likeStatusForCommentE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  commentId: string = ObjectIdValid,
  tokenUser: string,
): Promise<Response> => {
  let body: { likeStatus: string } = exampleLikeStatus;
  let commentIdForLike: string = commentId;
  let token: string = tokenUser;

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400) {
    body = exampleNotLikeStatus;
  }

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    commentIdForLike = ObjectIdValid;
  }

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    token = jwtTokenExample;
  }

  return await request(app)
    .put(RouterPathConst.comments + commentIdForLike + '/like-status')
    .set('Authorization', `Bearer ${token}`)
    .send(body)
    .expect(statusCode);
};
