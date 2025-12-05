import express, { Express } from 'express';
import { setupApp } from '../../src/setup-app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { runDB, stopDB } from '../../src/core/db/mango.db';
import { clearDbE2eUtil } from './utils/clear-db.e2e.util';
import request, { Response } from 'supertest';
import { createUserE2eUtil } from './utils/users/create-user.e2e.util';
import { HTTP_STATUS } from '../../src/core/enums/http-status.enum';
import { RouterPathConst } from '../../src/core/constants/router-path.const';
import { loginE2eUtil } from './utils/auth/login.e2e.util';

describe('Security Devices test', () => {
  const app: Express = express();
  setupApp(app);

  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const url: string = mongoServer.getUri();
    await runDB(url);
  });

  beforeEach(async () => {
    await clearDbE2eUtil(app);
  });

  afterEach(async () => {
    await clearDbE2eUtil(app);
  });

  afterAll(async () => {
    await mongoServer.stop();
    await stopDB();
  });

  describe('test' + RouterPathConst.securityDevices, () => {
    describe('get session devices', () => {
      it('should return status 200 OK and one session', async () => {
        await createUserE2eUtil(app, HTTP_STATUS.CREATED_201);

        const response: Response = await loginE2eUtil(app, HTTP_STATUS.OK_200);

        const cookies: string = response.headers['set-cookie'];

        const responseSecurity: Response = await request(app)
          .get(RouterPathConst.securityDevices)
          .set('Cookie', cookies)
          .expect(HTTP_STATUS.OK_200);

        expect(responseSecurity.body).toEqual([
          {
            ip: expect.any(String),
            title: expect.any(String),
            lastActiveDate: expect.any(String),
            deviceId: expect.any(String),
          },
        ]);
      });

      it('should return 401 Unauthorized if refreshToken cookie is invalid', async () => {
        await createUserE2eUtil(app, HTTP_STATUS.CREATED_201);

        await loginE2eUtil(app, HTTP_STATUS.OK_200);

        const cookies: string = 'test-cookie';

        await request(app)
          .get(RouterPathConst.securityDevices)
          .set('Cookie', cookies)
          .expect(HTTP_STATUS.UNAUTHORIZED_401);
      });
    });

    describe('remove session devices', () => {
      it('should return status 204 and remove other sessions', async () => {
        await createUserE2eUtil(app, HTTP_STATUS.CREATED_201);

        const response: Response = await loginE2eUtil(app, HTTP_STATUS.OK_200);

        const cookies: string = response.headers['set-cookie'];

        await request(app)
          .delete(RouterPathConst.securityDevices)
          .set('Cookie', cookies)
          .expect(HTTP_STATUS.NO_CONTENT_204);

        const responseSession: Response = await request(app)
          .get(RouterPathConst.securityDevices)
          .set('Cookie', cookies)
          .expect(HTTP_STATUS.OK_200);

        expect(responseSession.body).toEqual([
          {
            ip: expect.any(String),
            title: expect.any(String),
            lastActiveDate: expect.any(String),
            deviceId: expect.any(String),
          },
        ]);
      });
      it('should ', async () => {
        const cookies: string = 'badcookie';

        await request(app)
          .delete(RouterPathConst.securityDevices)
          .set('Cookie', cookies)
          .expect(HTTP_STATUS.UNAUTHORIZED_401);
      });
    });
  });
});
