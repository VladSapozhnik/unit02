import { emailAdapter } from '../../src/core/adapters/email.adapter';
import { authService } from '../../src/modules/auth/application/auth.service';
import { Result } from '../../src/core/types/result.type';
import { UserDbType } from '../../src/modules/users/type/user.type';
import { ResultStatus } from '../../src/core/enums/result-status.enum';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { runDB, stopDB } from '../../src/core/db/mango.db';
import { clearDbE2eUtil } from '../e2e/utils/clear-db.e2e.util';
import express, { type Express } from 'express';
import { setupApp } from '../../src/setup-app';

describe('auth-integration test', () => {
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

  describe('registration test', () => {
    jest.spyOn(emailAdapter, 'sendEmail').mockResolvedValue(true);

    const registrationUserUseCase = authService.registration;

    it('should return', async () => {
      const emailSend = {
        login: 'TX17Vq',
        password: 'string',
        email: 'example@example.com',
      };

      const result: Result<UserDbType | null> =
        await registrationUserUseCase(emailSend);

      expect(result.status).toEqual(ResultStatus.Success);
      expect(result.data?.login).toEqual(emailSend.login);
      expect(emailAdapter.sendEmail).toHaveBeenCalled();
      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1);
    });
  });
});
