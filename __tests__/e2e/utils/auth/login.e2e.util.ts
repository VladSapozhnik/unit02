import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPathConst } from '../../../../src/core/constants/router-path.const';
import { HTTP_STATUS } from '../../../../src/core/enums/http-status.enum';
import { LoginDto } from '../../../../src/modules/auth/dto/login.dto';
import {
  exampleCreateUser,
  exampleCreateTwoUser,
} from '../users/create-user.e2e.util';

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

const exampleTwoUserLogin: LoginDto = {
  loginOrEmail: exampleCreateTwoUser.email,
  password: exampleCreateTwoUser.password,
};

export const loginE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  loginUserNumberTwo: boolean = false,
  loginUser: LoginDto = exampleLogin,
): Promise<Response> => {
  let body: LoginDto = loginUser;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    body = exampleNonLogin;
  }

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400) {
    body = exampleBadRequestLogin;
  }

  if (loginUserNumberTwo) {
    body = exampleTwoUserLogin;
  }

  if (statusCode === HTTP_STATUS.OK_200) {
    const response: Response = await request(app)
      .post(RouterPathConst.auth + 'login')
      .send(body)
      .expect(statusCode);

    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });

    return response;
  }
  return await request(app)
    .post(RouterPathConst.auth + 'login')
    .send(body)
    .expect(statusCode);
};
