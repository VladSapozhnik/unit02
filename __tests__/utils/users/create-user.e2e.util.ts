import request, { Response } from 'supertest';
import { Express } from 'express';
import { RouterPathConst } from '../../../src/core/constants/router-path.const';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../../src/core/middleware/super-admin-guard.middleware';
import { HTTP_STATUS } from '../../../src/core/enums/http-status.enum';
import { CreateUserDto } from '../../../src/modules/users/dto/create-user.dto';

export const exampleCreateUser: CreateUserDto = {
  login: 'PBvSR4UeDA',
  password: 'string',
  email: 'example@example.com',
};

export const exampleNonCreateUser: CreateUserDto = {
  login: '',
  password: '',
  email: '',
};

export const createUserE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
): Promise<Response> => {
  let username: string = ADMIN_USERNAME;
  let password: string = ADMIN_PASSWORD;
  let body: CreateUserDto = exampleCreateUser;

  if (statusCode === HTTP_STATUS.UNAUTHORIZED_401) {
    username = 'not authorized';
    password = 'not authorized';
  }

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400) {
    body = exampleNonCreateUser;
  }

  return await request(app)
    .post(RouterPathConst.users)
    .auth(username, password)
    .send(body)
    .expect(statusCode);
};
