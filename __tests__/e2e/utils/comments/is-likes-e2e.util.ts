import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPathConst } from '../../../../src/core/constants/router-path.const';
import { HTTP_STATUS } from '../../../../src/core/enums/http-status.enum';
import { ObjectIdValid } from '../../blogs.e2e.spec';
import { LikeStatusEnum } from '../../../../src/modules/likes/enums/like-status.enum';

export const jwtTokenExample: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0VXNlciIsImlhdCI6MTYwMDAwMDAsImV4cCI6MTYwMDAwMDF.INVALID_SIGNATURE';

export const isLikeForCommentE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  commentId: string = ObjectIdValid,
  tokenUser: string,
  countLike: number = 0,
) => {
  let token: string = tokenUser;
  let statusLike: LikeStatusEnum = LikeStatusEnum.Like;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    token = jwtTokenExample;
    statusLike = LikeStatusEnum.None;
  }

  const getComments: Response = await request(app)
    .get(RouterPathConst.comments + commentId)
    .set('Authorization', `Bearer ${token}`)
    .expect(HTTP_STATUS.OK_200);

  expect(getComments.body.likesInfo.likesCount).toEqual(countLike);
  expect(getComments.body.likesInfo.myStatus).toEqual(statusLike);
};
