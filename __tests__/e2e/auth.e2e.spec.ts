import { RouterPathConst } from '../../src/core/constants/router-path.const';
import express from 'express';
import { setupApp } from '../../src/setup-app';
import { runDB, stopDB } from '../../src/core/db/mango.db';
import { clearDbE2eUtil } from './utils/clear-db.e2e.util';
import { createUserE2eUtil } from './utils/users/create-user.e2e.util';
import { HTTP_STATUS } from '../../src/core/enums/http-status.enum';
import { loginE2eUtil } from './utils/auth/login.e2e.util';
import { profileE2eUtil } from './utils/auth/profile.e2e.util';
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

  // beforeEach(async () => {
  //   await clearDbE2eUtil(app);
  // });

  afterAll(async () => {
    await clearDbE2eUtil(app);
    await mongoServer.stop();
    await stopDB();
  });

  it('should be able to sign in', async () => {
    await createUserE2eUtil(app, HTTP_STATUS.CREATED_201);

    await loginE2eUtil(app, HTTP_STATUS.OK_200);
  });

  it('should return 400 if login fields are empty', async () => {
    await loginE2eUtil(app, HTTP_STATUS.BAD_REQUEST_400);
  });

  it('should not login and return 401 for non-existing user', async () => {
    await loginE2eUtil(app, HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should not profile and return 401 for invalid token', async () => {
    await profileE2eUtil(app, HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should profile and return 200 for valid token', async () => {
    await profileE2eUtil(app, HTTP_STATUS.OK_200);
  });
});
