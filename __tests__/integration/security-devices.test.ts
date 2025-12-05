import { authService } from '../../src/modules/auth/application/auth.service';
import { Result } from '../../src/core/types/result.type';
import { ResultStatus } from '../../src/core/enums/result-status.enum';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { runDB, stopDB } from '../../src/core/db/mango.db';
import { clearDbE2eUtil } from '../e2e/utils/clear-db.e2e.util';
import express, { type Express } from 'express';
import { setupApp } from '../../src/setup-app';
import { testSeeder } from './test.seeder';
import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';
import { jwtAdapter } from '../../src/core/adapters/jwt.adapter';
import { LoginDto } from '../../src/modules/auth/dto/login.dto';
import { securityDevicesService } from '../../src/modules/security-devices/application/security-devices.service';
import { JwtPayload } from 'jsonwebtoken';
import { securityDevicesQueryService } from '../../src/modules/security-devices/application/security-devices.query.service';

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

  describe('remove sessions by deviceId', () => {
    const loginUseCase = authService.login;
    const refreshTokenVerifyUseCase = jwtAdapter.verifyRefreshToken;
    const getSessions = securityDevicesQueryService.getSessionByUser;
    const removeSessionUseCase = securityDevicesService.removeDeviceSession;
    const user: CreateUserDto = testSeeder.createUserDto();

    const ipDeviceTwo = '127.0.0.666';
    const titleDeviceTwo = 'testTitleTwo';

    const ip = '127.0.0.333';
    const title = 'testTitle';

    it('should remove session by device id and keep other sessions', async () => {
      await testSeeder.insertUser(user);

      const loginDto: LoginDto = {
        loginOrEmail: user.email,
        password: user.password,
      };

      const userLoginOne = await loginUseCase(loginDto, ip, title);

      const payload: JwtPayload = refreshTokenVerifyUseCase(
        userLoginOne.refreshToken,
      ) as JwtPayload;

      const deviceId: string = payload.deviceId as string;

      await loginUseCase(loginDto, ipDeviceTwo, titleDeviceTwo);

      const sessions = await getSessions(userLoginOne.refreshToken);

      expect(sessions).toEqual([
        {
          ip: ip,
          title: title,
          lastActiveDate: expect.any(Date),
          deviceId: expect.any(String),
        },
        {
          ip: ipDeviceTwo,
          title: titleDeviceTwo,
          lastActiveDate: expect.any(Date),
          deviceId: expect.any(String),
        },
      ]);

      await removeSessionUseCase(deviceId, userLoginOne.refreshToken);

      const newSessions = await getSessions(userLoginOne.refreshToken);

      expect(newSessions).toEqual([
        {
          ip: ipDeviceTwo,
          title: titleDeviceTwo,
          lastActiveDate: expect.any(Date),
          deviceId: expect.any(String),
        },
      ]);
    });

    it('should return all sessions and prevent unauthorized session removal', async () => {
      await testSeeder.insertUser(user);

      const loginDto: LoginDto = {
        loginOrEmail: user.email,
        password: user.password,
      };

      const userLoginOne = await loginUseCase(loginDto, ip, title);

      const payload: JwtPayload = refreshTokenVerifyUseCase(
        userLoginOne.refreshToken,
      ) as JwtPayload;

      const deviceId: string = payload.deviceId as string;

      await loginUseCase(loginDto, ipDeviceTwo, titleDeviceTwo);

      const sessions = await getSessions(userLoginOne.refreshToken);

      expect(sessions).toEqual([
        {
          ip: ip,
          title: title,
          lastActiveDate: expect.any(Date),
          deviceId: deviceId,
        },
        {
          ip: ipDeviceTwo,
          title: titleDeviceTwo,
          lastActiveDate: expect.any(Date),
          deviceId: expect.any(String),
        },
      ]);

      const isRemoveSession: Result<null> = await removeSessionUseCase(
        deviceId,
        'notRefreshToken',
      );

      expect(isRemoveSession.status).toEqual(ResultStatus.Unauthorized);

      const newSessions = await getSessions(userLoginOne.refreshToken);

      expect(newSessions).toEqual([
        {
          ip: ip,
          title: title,
          lastActiveDate: expect.any(Date),
          deviceId: deviceId,
        },
        {
          ip: ipDeviceTwo,
          title: titleDeviceTwo,
          lastActiveDate: expect.any(Date),
          deviceId: expect.any(String),
        },
      ]);
    });

    it('should return all sessions and not remove a non-existing session', async () => {
      await testSeeder.insertUser(user);

      const loginDto: LoginDto = {
        loginOrEmail: user.email,
        password: user.password,
      };

      const userLoginOne = await loginUseCase(loginDto, ip, title);

      const payload: JwtPayload = refreshTokenVerifyUseCase(
        userLoginOne.refreshToken,
      ) as JwtPayload;

      const deviceId: string = payload.deviceId as string;

      await loginUseCase(loginDto, ipDeviceTwo, titleDeviceTwo);

      const sessions = await getSessions(userLoginOne.refreshToken);

      expect(sessions).toEqual([
        {
          ip: ip,
          title: title,
          lastActiveDate: expect.any(Date),
          deviceId: expect.any(String),
        },
        {
          ip: ipDeviceTwo,
          title: titleDeviceTwo,
          lastActiveDate: expect.any(Date),
          deviceId: expect.any(String),
        },
      ]);

      const isRemoveSession: Result<null> = await removeSessionUseCase(
        '123',
        userLoginOne.refreshToken,
      );

      expect(isRemoveSession.status).toEqual(ResultStatus.NotFound);

      const newSessions = await getSessions(userLoginOne.refreshToken);

      expect(newSessions).toEqual([
        {
          ip: ip,
          title: title,
          lastActiveDate: expect.any(Date),
          deviceId: deviceId,
        },
        {
          ip: ipDeviceTwo,
          title: titleDeviceTwo,
          lastActiveDate: expect.any(Date),
          deviceId: expect.any(String),
        },
      ]);
    });

    it('should23123223131 successfully sessions by device id', async () => {
      await testSeeder.insertUser(user);

      const loginDto: LoginDto = {
        loginOrEmail: user.email,
        password: user.password,
      };

      const userLoginOne = await loginUseCase(loginDto, ip, title);

      const payload: JwtPayload = refreshTokenVerifyUseCase(
        userLoginOne.refreshToken,
      ) as JwtPayload;

      const deviceId: string = payload.deviceId as string;

      const sessions = await getSessions(userLoginOne.refreshToken);

      expect(sessions).toEqual([
        {
          ip: ip,
          title: title,
          lastActiveDate: expect.any(Date),
          deviceId: deviceId,
        },
      ]);

      // await removeSessionUseCase(deviceId, userLoginOne.refreshToken);

      const loginUserThreeDto: LoginDto = {
        loginOrEmail: user.email,
        password: user.password,
      };

      const userLoginThree = await loginUseCase(
        loginUserThreeDto,
        '123.242.44.55',
        '123NB',
      );

      const isRemoveSession: Result<null> = await removeSessionUseCase(
        deviceId,
        userLoginThree.refreshToken,
      );

      expect(isRemoveSession.status).toEqual(ResultStatus.Forbidden);
    });
  });
});
