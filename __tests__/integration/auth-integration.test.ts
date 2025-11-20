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
import { testSeeder } from './test.seeder';
import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';

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

    it('should register user with correct user data', async () => {
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

    it('should not register user and status 400 with duplicate login user data', async () => {
      const emailSendDuplicateLogin: CreateUserDto = {
        login: 'TX17Vq',
        password: 'string',
        email: 'example2@example.com',
      };

      const user: CreateUserDto = testSeeder.createUserDto();

      await testSeeder.insertUser(user);

      const resultDuplicateLogin: Result<UserDbType | null> =
        await registrationUserUseCase(emailSendDuplicateLogin);

      expect(resultDuplicateLogin.status).toEqual(ResultStatus.BadRequest);
      expect(resultDuplicateLogin.extensions).toEqual([
        { field: 'login', message: 'User already exists' },
      ]);
    });

    it('should not register user and status 400 with duplicate email user data', async () => {
      const emailSendDuplicateLogin: CreateUserDto = {
        login: 'TX12Vq',
        password: 'string',
        email: 'example*@example.com',
      };

      const user: CreateUserDto = testSeeder.createUserDto();

      await testSeeder.insertUser(user);

      const resultDuplicateLogin: Result<UserDbType | null> =
        await registrationUserUseCase(emailSendDuplicateLogin);

      expect(resultDuplicateLogin.status).toEqual(ResultStatus.BadRequest);
      expect(resultDuplicateLogin.extensions).toEqual([
        { field: 'email', message: 'Email already exists' },
      ]);
    });
  });

  describe('resend email test', () => {
    jest.spyOn(emailAdapter, 'sendEmail').mockResolvedValue(true);

    const resendEmailUseCase = authService.resendEmail;

    it('should send email with correct email data', async () => {
      const newUser: CreateUserDto = testSeeder.createUserDto();

      await testSeeder.insertUser(newUser);

      const resendEmail: Result = await resendEmailUseCase(newUser.email);

      expect(resendEmail.status).toEqual(ResultStatus.Success);
      expect(emailAdapter.sendEmail).toHaveBeenCalled();
      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1);
    });

    it('should not send email when the email does not exist', async () => {
      const newUser: CreateUserDto = testSeeder.createUserDto();
      const email: string = 'nottest@gmail.com';

      await testSeeder.insertUser(newUser);

      const resendEmail: Result = await resendEmailUseCase(email);

      expect(resendEmail.status).toEqual(ResultStatus.BadRequest);
      expect(resendEmail.extensions).toEqual([
        {
          field: 'email',
          message: 'Email is already confirmed or does not exist',
        },
      ]);
    });
  });
});
