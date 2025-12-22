import { emailAdapter } from '../../src/core/adapters/email.adapter';
import { AuthService } from '../../src/modules/auth/application/auth.service';
import { Result } from '../../src/core/types/result.type';
import { ResultStatus } from '../../src/core/enums/result-status.enum';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { runDB, stopDB } from '../../src/core/db/mongo.db';
import { clearDbE2eUtil } from '../e2e/utils/clear-db.e2e.util';
import express from 'express';
import { type Express } from 'express';
import { setupApp } from '../../src/setup-app';
import { testSeeder } from './test.seeder';
import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';
import { add } from 'date-fns/add';
import { sub } from 'date-fns/sub';
import { SecurityDevicesRepository } from '../../src/modules/security-devices/repositories/security-devices.repository';
import { PasswordRecoveryRepository } from '../../src/modules/password-recovery/repositories/password-recovery.repository';
import { UsersRepository } from '../../src/modules/users/repositories/users.repository';
import { PasswordRecoveryDBType } from '../../src/modules/password-recovery/types/password-recovery.type';
import { Types } from 'mongoose';
import { generateId } from '../../src/core/constants/generate-id';
import {
  UsersDocument,
  UsersModel,
} from '../../src/modules/users/entities/user.entity';

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

    const authService = new AuthService(
      new UsersRepository(),
      new SecurityDevicesRepository(),
      new PasswordRecoveryRepository(),
    );

    const registrationUserUseCase = authService.registration.bind(authService);

    it('should register user with correct user data', async () => {
      const emailSend = {
        login: 'TX17Vq',
        password: 'string',
        email: 'example@example.com',
      };

      const result: Result<UsersDocument | null> =
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

      const resultDuplicateLogin: Result<UsersDocument | null> =
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

      const resultDuplicateLogin: Result<UsersDocument | null> =
        await registrationUserUseCase(emailSendDuplicateLogin);

      expect(resultDuplicateLogin.status).toEqual(ResultStatus.BadRequest);
      expect(resultDuplicateLogin.extensions).toEqual([
        { field: 'email', message: 'Email already exists' },
      ]);
    });
  });

  describe('confirm email by code', () => {
    const authService = new AuthService(
      new UsersRepository(),
      new SecurityDevicesRepository(),
      new PasswordRecoveryRepository(),
    );

    const usersRepository = new UsersRepository();

    const confirmedEmailUseCase = authService.confirmEmail.bind(authService);
    const createdUserUseCase = usersRepository.createUser.bind(usersRepository);
    const findUserByCodeUseCase =
      usersRepository.findUserByCode.bind(usersRepository);
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

      const newUser = new UsersModel({
        ...createUser,
        password: 'user123hash',
        emailConfirmation: {
          confirmationCode: code,
          expirationDate: sub(new Date(), {
            hours: 1,
            minutes: 30,
          }),
          isConfirmed: false,
        },
      });

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

      const newUser = new UsersModel({
        ...createUser,
        password: 'user123hash',
        emailConfirmation: {
          confirmationCode: code,
          expirationDate: add(new Date(), {
            hours: 1,
            minutes: 30,
          }),
          isConfirmed: true,
        },
      });

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

      const newUser = new UsersModel({
        ...createUser,
        password: 'user123hash',
        emailConfirmation: {
          confirmationCode: code,
          expirationDate: add(new Date(), {
            hours: 1,
            minutes: 30,
          }),
          isConfirmed: false,
        },
      });

      // const newUser: UsersDocument = {
      //   _id: new Types.ObjectId(),
      //   ...createUser,
      //   password: 'user123hash',
      //   createdAt: new Date(),
      //   emailConfirmation: {
      //     confirmationCode: code,
      //     expirationDate: add(new Date(), {
      //       hours: 1,
      //       minutes: 30,
      //     }),
      //     isConfirmed: false,
      //   },
      // };

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

    const authService = new AuthService(
      new UsersRepository(),
      new SecurityDevicesRepository(),
      new PasswordRecoveryRepository(),
    );

    const resendEmailUseCase = authService.resendEmail.bind(authService);

    it('should send email with correct email data', async () => {
      const newUser: CreateUserDto = testSeeder.createUserDto();

      await testSeeder.insertUser(newUser);

      const resendEmail: Result = await resendEmailUseCase(newUser.email);

      expect(resendEmail.status).toEqual(ResultStatus.Success);
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

  describe('Password Recovery', () => {
    jest.spyOn(emailAdapter, 'sendEmail').mockResolvedValue(true);

    const authService = new AuthService(
      new UsersRepository(),
      new SecurityDevicesRepository(),
      new PasswordRecoveryRepository(),
    );

    const passwordRecovery = authService.passwordRecovery.bind(authService);

    it('should successfully send password recovery for existing user', async () => {
      const user: CreateUserDto = testSeeder.createUserDto();

      await testSeeder.insertUser(user);

      const isPasswordRecovery = await passwordRecovery(user.email);

      expect(isPasswordRecovery.status).toEqual(ResultStatus.Success);
    });
  });

  describe('Password Recovery', () => {
    jest.spyOn(emailAdapter, 'sendEmail').mockResolvedValue(true);

    const recoveryCode: string = generateId();
    const newPasswordDate = 'new123567';

    const authService = new AuthService(
      new UsersRepository(),
      new SecurityDevicesRepository(),
      new PasswordRecoveryRepository(),
    );

    const newPasswordUseCase = authService.newPassword.bind(authService);

    const passwordRecoveryRepositoryUseCase = new PasswordRecoveryRepository();

    it('should update user password and mark recovery code as used', async () => {
      const user: CreateUserDto = testSeeder.createUserDto();

      const existingUser = await testSeeder.insertUser(user);

      const recoveryData: PasswordRecoveryDBType = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(existingUser._id),
        recoveryCode: recoveryCode,
        expirationDate: add(new Date(), {
          minutes: 30,
        }),
        isUsed: false,
      };

      await passwordRecoveryRepositoryUseCase.addPasswordRecoveryCode(
        recoveryData,
      );

      const isNewPassword = await newPasswordUseCase(
        newPasswordDate,
        recoveryCode,
      );

      expect(isNewPassword.status).toEqual(ResultStatus.Success);
    });

    it('should return BadRequest when recovery code has expired', async () => {
      const user: CreateUserDto = testSeeder.createUserDto();

      const existingUser = await testSeeder.insertUser(user);

      const recoveryData: PasswordRecoveryDBType = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(existingUser._id),
        recoveryCode: recoveryCode,
        expirationDate: new Date(),
        isUsed: false,
      };

      await passwordRecoveryRepositoryUseCase.addPasswordRecoveryCode(
        recoveryData,
      );

      const isNewPassword = await newPasswordUseCase(
        newPasswordDate,
        recoveryCode,
      );

      expect(isNewPassword.status).toEqual(ResultStatus.BadRequest);
    });

    it('should return BadRequest when recovery code has already been used', async () => {
      const user: CreateUserDto = testSeeder.createUserDto();

      const existingUser = await testSeeder.insertUser(user);

      const recoveryData: PasswordRecoveryDBType = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(existingUser._id),
        recoveryCode: recoveryCode,
        expirationDate: add(new Date(), {
          minutes: 30,
        }),
        isUsed: true,
      };

      await passwordRecoveryRepositoryUseCase.addPasswordRecoveryCode(
        recoveryData,
      );

      const isNewPassword = await newPasswordUseCase(
        newPasswordDate,
        recoveryCode,
      );

      expect(isNewPassword.status).toEqual(ResultStatus.BadRequest);
    });

    it('should return BadRequest when recovery code does not exist', async () => {
      const isNewPassword = await newPasswordUseCase(
        newPasswordDate,
        recoveryCode,
      );

      expect(isNewPassword.status).toEqual(ResultStatus.BadRequest);
    });
  });
});
