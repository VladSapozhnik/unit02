import { RouterPathConst } from '../src/core/constants/router-path.const';
import express from 'express';
import { setupApp } from '../src/setup-app';
import { runDB, stopDB } from '../src/core/db/mango.db';
import { settings } from '../src/core/settings/settings';
import { clearDbE2eUtil } from './utils/clear-db.e2e.util';
import request from 'supertest';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from '../src/core/middleware/super-admin-guard.middleware';

describe('test' + RouterPathConst.users, () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(settings.MONGO_URI_TESTING);
    await clearDbE2eUtil(app);
  });

  afterAll(async () => {
    await clearDbE2eUtil(app);
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
});
