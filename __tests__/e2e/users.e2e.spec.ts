import { RouterPathConst } from '../../src/core/constants/router-path.const';
import express from 'express';
import { setupApp } from '../../src/setup-app';
import { runDB, stopDB } from '../../src/core/db/mongo.db';
import { clearDbE2eUtil } from './utils/clear-db.e2e.util';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../../src/core/middleware/super-admin-guard.middleware';
import {
  ACTION_CREATE_USER,
  createUserE2eUtil,
} from './utils/users/create-user.e2e.util';
import { HTTP_STATUS } from '../../src/core/enums/http-status.enum';
import { getUsersE2eUtil } from './utils/users/get-users.e2e.util';
import request, { type Response } from 'supertest';
import { removeUserE2eUtil } from './utils/users/remove-user.e2e.util';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('test' + RouterPathConst.users, () => {
  const app = express();
  setupApp(app);
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const url: string = mongoServer.getUri();
    await runDB(url);
    await clearDbE2eUtil(app);
  });

  beforeEach(async () => {
    await clearDbE2eUtil(app);
  });

  afterAll(async () => {
    await clearDbE2eUtil(app);
    await mongoServer.stop();
    await stopDB();
  });

  it('should get users from database auth', async () => {
    await request(app)
      .get(RouterPathConst.users)
      .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
      .expect(200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
  });

  it('should return correct pagination metadata for users list', async () => {
    await createUserE2eUtil(app, HTTP_STATUS.CREATED_201);
    const response: Response = await createUserE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
      ACTION_CREATE_USER.PAGINATION_AND_SEARCH,
    );

    await getUsersE2eUtil(app, HTTP_STATUS.OK_200, response.body, true);
  });

  it('should return 401 and not get users if user is not authorized', async () => {
    await getUsersE2eUtil(app, HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should create user and status 201 from database auth', async () => {
    const response: Response = await createUserE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await getUsersE2eUtil(app, HTTP_STATUS.OK_200, response.body);
  });

  it('should return 401 and not create user if user is not authorized', async () => {
    await createUserE2eUtil(app, HTTP_STATUS.UNAUTHORIZED_401);

    await getUsersE2eUtil(app, HTTP_STATUS.OK_200);
  });

  it('should not create user with invalid or duplicate data', async () => {
    await createUserE2eUtil(app, HTTP_STATUS.BAD_REQUEST_400);

    await getUsersE2eUtil(app, HTTP_STATUS.OK_200);
  });

  it('should not create user if login or email already exists', async () => {
    const response: Response = await createUserE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await createUserE2eUtil(
      app,
      HTTP_STATUS.BAD_REQUEST_400,
      ACTION_CREATE_USER.DUPLICATE_USER,
    );

    await getUsersE2eUtil(app, HTTP_STATUS.OK_200, response.body);
  });

  it('should remove user and status 201 from database auth', async () => {
    const response: Response = await createUserE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removeUserE2eUtil(app, HTTP_STATUS.NO_CONTENT_204, response.body.id);

    await getUsersE2eUtil(app, HTTP_STATUS.OK_200);
  });

  it('should return 401 and not remove user if user is not authorized', async () => {
    const response: Response = await createUserE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removeUserE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      response.body.id,
    );

    await getUsersE2eUtil(app, HTTP_STATUS.OK_200, response.body);
  });

  it('should return 404 and not remove user if user is Bad Request', async () => {
    const response: Response = await createUserE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removeUserE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, response.body.id);

    await getUsersE2eUtil(app, HTTP_STATUS.OK_200, response.body);
  });
});
