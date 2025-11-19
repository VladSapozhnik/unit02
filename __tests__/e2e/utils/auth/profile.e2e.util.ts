import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPathConst } from '../../../../src/core/constants/router-path.const';
import { HTTP_STATUS } from '../../../../src/core/enums/http-status.enum';
import { loginE2eUtil } from './login.e2e.util';

export const profileE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
): Promise<Response> => {
  const response: Response = await loginE2eUtil(app, HTTP_STATUS.OK_200);

  let token: string = response.body.accessToken;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    token = 'badtoken';
  }

  return await request(app)
    .get(RouterPathConst.auth + 'me')
    .set('Authorization', `Bearer ${token}`)
    .expect(statusCode);
};
