import { emailAdapter } from '../../src/core/adapters/email.adapter';
import { authService } from '../../src/modules/auth/application/auth.service';
import { Result } from '../../src/core/types/result.type';
import { UserWithPasswordType } from '../../src/modules/users/type/user.type';
import { ResultStatus } from '../../src/core/enums/result-status.enum';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { runDB, stopDB } from '../../src/core/db/mango.db';
import { clearDbE2eUtil } from '../e2e/utils/clear-db.e2e.util';
import express, { type Express } from 'express';
import { setupApp } from '../../src/setup-app';
import { testSeeder } from './test.seeder';
import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';
import { createdAtHelper } from '../../src/core/helpers/created-at.helper';
import { add } from 'date-fns/add';
import { sub } from 'date-fns/sub';
import { usersRepository } from '../../src/modules/users/repositories/users.repository';
import { AccessAndRefreshTokensType } from '../../src/modules/auth/type/access-and-refresh-tokens.type';
import { jwtAdapter } from '../../src/core/adapters/jwt.adapter';

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

      const result: Result<UserWithPasswordType | null> =
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

      const resultDuplicateLogin: Result<UserWithPasswordType | null> =
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
        email: 'example@example.com',
      };

      const user: CreateUserDto = testSeeder.createUserDto();

      await testSeeder.insertUser(user);

      const resultDuplicateLogin: Result<UserWithPasswordType | null> =
        await registrationUserUseCase(emailSendDuplicateLogin);

      expect(resultDuplicateLogin.status).toEqual(ResultStatus.BadRequest);
      expect(resultDuplicateLogin.extensions).toEqual([
        { field: 'email', message: 'Email already exists' },
      ]);
    });
  });

  describe('confirm email by code', () => {
    const confirmedEmailUseCase = authService.confirmEmail;
    const createdUserUseCase = usersRepository.createUser;
    const findUserByCodeUseCase = usersRepository.findUserByCode;
    const code: string = '123123123';

    it('should not confirm email if user does not exist', async () => {
      const isConfirm: Result = await confirmedEmailUseCase(code);

      expect(isConfirm.status).toEqual(ResultStatus.BadRequest);
      expect(isConfirm.extensions).toEqual([
        { field: 'code', message: 'Invalid confirmation code' },
      ]);
    });

    it('should not confirm email with expired code', async () => {
      const createUser: CreateUserDto = testSeeder.createUserDto();

      const newUser: UserWithPasswordType = {
        ...createUser,
        password: 'user123hash',
        createdAt: createdAtHelper(),
        emailConfirmation: {
          confirmationCode: code,
          expirationDate: sub(new Date(), {
            hours: 1,
            minutes: 30,
          }),
          isConfirmed: false,
        },
      };

      await createdUserUseCase(newUser);

      const isConfirm: Result = await confirmedEmailUseCase(code);

      const userFindCode = await findUserByCodeUseCase(code);

      expect(isConfirm.status).toEqual(ResultStatus.BadRequest);
      expect(isConfirm.extensions).toEqual([
        { field: 'code', message: 'Bad code for registration' },
      ]);
      expect(userFindCode!.emailConfirmation.isConfirmed).toEqual(false);
      expect(userFindCode!.email).toEqual(newUser.email);
    });

    it('should not confirm email which is confirmed', async () => {
      const createUser: CreateUserDto = testSeeder.createUserDto();

      const newUser: UserWithPasswordType = {
        ...createUser,
        password: 'user123hash',
        createdAt: createdAtHelper(),
        emailConfirmation: {
          confirmationCode: code,
          expirationDate: add(new Date(), {
            hours: 1,
            minutes: 30,
          }),
          isConfirmed: true,
        },
      };

      await createdUserUseCase(newUser);

      const isConfirm: Result = await confirmedEmailUseCase(code);

      const userFindCode = await findUserByCodeUseCase(code);

      expect(isConfirm.status).toEqual(ResultStatus.BadRequest);
      expect(isConfirm.extensions).toEqual([
        { field: 'code', message: 'Bad code for registration' },
      ]);
      expect(userFindCode!.emailConfirmation.isConfirmed).toEqual(true);
      expect(userFindCode!.email).toEqual(newUser.email);
    });

    it('should confirm user for correct code', async () => {
      const createUser: CreateUserDto = testSeeder.createUserDto();

      const newUser: UserWithPasswordType = {
        ...createUser,
        password: 'user123hash',
        createdAt: createdAtHelper(),
        emailConfirmation: {
          confirmationCode: code,
          expirationDate: add(new Date(), {
            hours: 1,
            minutes: 30,
          }),
          isConfirmed: false,
        },
      };

      await createdUserUseCase(newUser);

      const isConfirm: Result = await confirmedEmailUseCase(code);

      const userFindCode = await findUserByCodeUseCase(code);

      expect(isConfirm.status).toEqual(ResultStatus.Success);
      expect(userFindCode!.emailConfirmation.isConfirmed).toEqual(true);
      expect(userFindCode!.email).toEqual(newUser.email);
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
      // expect(emailAdapter.sendEmail).toHaveBeenCalled();
      // expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1);
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

  describe('refresh token in cookie', () => {
    const findUserByCodeUseCase = usersRepository.findUserByCode;
    const refreshTokenUseCase = authService.refreshToken;

    const code: string = '123123123';

    it('should access and refresh tokens and status 200', async () => {
      const createUser: CreateUserDto = testSeeder.createUserDto();

      const newUserDto = {
        ...createUser,
        code,
      };

      await testSeeder.insertUser(newUserDto);

      const user = await findUserByCodeUseCase(code);

      const deviceId = '321321321';

      const refreshToken: string = await jwtAdapter.createRefreshToken(
        user!._id.toString(),
        deviceId,
      );

      const result: Result<AccessAndRefreshTokensType | null> =
        await refreshTokenUseCase(refreshToken, 'testIp', 'testTitle');

      expect(result.status).toEqual(ResultStatus.Success);
      expect(result.data).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });
});
