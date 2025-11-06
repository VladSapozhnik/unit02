import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPathConst } from '../../../src/core/constants/router-path.const';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import { LoginDto } from '../../../src/modules/auth/dto/login.dto';
import { exampleCreateUser } from '../users/create-user.e2e.util';

const exampleLogin: LoginDto = {
  loginOrEmail: exampleCreateUser.email,
  password: exampleCreateUser.password,
};

const exampleBadRequestLogin: LoginDto = {
  loginOrEmail: '',
  password: '',
};

const exampleNonLogin: LoginDto = {
  loginOrEmail: 'exm@noexam.com',
  password: 'noexaple',
};

export const loginE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
): Promise<Response> => {
  let body: LoginDto = exampleLogin;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    body = exampleNonLogin;
  }

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400) {
    body = exampleBadRequestLogin;
  }

  return await request(app)
    .post(RouterPathConst.auth + 'login')
    .send(body)
    .expect(statusCode);
};
