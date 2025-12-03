import { LoginDto } from '../dto/login.dto';
import { usersRepository } from '../../users/repositories/users.repository';
import { UserType, UserWithPasswordType } from '../../users/type/user.type';
import { hashAdapter } from '../../../core/adapters/hash.adapter';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { ObjectId, WithId } from 'mongodb';
import { generateId } from '../../../core/constants/generate-id';
import { add } from 'date-fns/add';
import { ResendEmailType } from '../type/resend-email.type';
import { emailAdapter } from '../../../core/adapters/email.adapter';
import { ResultStatus } from '../../../core/enums/result-status.enum';
import { Result } from '../../../core/types/result.type';
import { jwtAdapter } from '../../../core/adapters/jwt.adapter';
import { UnauthorizedError } from '../../../core/errors/unauthorized.error';
import { emailExamples } from '../../../core/adapters/email.examples';
import { AccessAndRefreshTokensType } from '../type/access-and-refresh-tokens.type';
import { JwtPayload } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { blacklistRepository } from '../../blacklist/repositories/blacklist.repository';
import { BlacklistType } from '../../blacklist/types/blacklist.type';
import { securityDevicesRepository } from '../../security-devices/repositories/security-devices.repository';
import { CreateSessionDto } from '../../security-devices/dto/create-session.dto';
import { SecurityDevicesType } from '../../security-devices/types/security-devices.type';
import { UpdateSessionDTO } from '../../security-devices/dto/update-session.dto';
import { AddBlacklistDto } from '../../blacklist/dto/add-blacklist.dto';

export const authService = {
  async registration(
    dto: CreateUserDto,
  ): Promise<Result<UserWithPasswordType | null>> {
    const hash: string = await hashAdapter.hashPassword(dto.password);

    const randomUUID = generateId();

    const newUser: UserWithPasswordType = {
      ...dto,
      password: hash,
      createdAt: createdAtHelper(),
      emailConfirmation: {
        confirmationCode: randomUUID,
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    };

    const isUser: WithId<UserType> | null =
      await usersRepository.getUserByLoginOrEmail(dto.login, dto.email);

    if (isUser) {
      if (isUser.login === dto.login) {
        return {
          status: ResultStatus.BadRequest,
          errorMessage: 'Bad Request',
          data: null,
          extensions: [{ field: 'login', message: 'User already exists' }],
        };
      } else if (isUser.email === dto.email) {
        return {
          status: ResultStatus.BadRequest,
          errorMessage: 'Bad Request',
          data: null,
          extensions: [{ field: 'email', message: 'Email already exists' }],
        };
      }
    }

    await usersRepository.createUser(newUser);

    try {
      await emailAdapter.sendEmail(
        dto.email,
        randomUUID,
        emailExamples.registrationEmail,
      );
    } catch (e) {
      console.log(e);
    }

    return {
      status: ResultStatus.Success,
      data: newUser,
      extensions: [],
    };
  },
  async confirmEmail(code: string): Promise<Result> {
    const user: WithId<UserType> | null =
      await usersRepository.findUserByCode(code);

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [{ field: 'code', message: 'Invalid confirmation code' }],
      };
    }

    if (
      user.emailConfirmation.isConfirmed ||
      user.emailConfirmation.expirationDate < new Date()
    ) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [{ field: 'code', message: 'Bad code for registration' }],
      };
    }

    await usersRepository.updateConfirmation(user._id.toString());

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
  async resendEmail(email: string): Promise<Result> {
    const newExpiration: Date = add(new Date(), { hours: 1, minutes: 30 });
    const newCode = generateId();

    const updateData: ResendEmailType = {
      'emailConfirmation.confirmationCode': newCode,
      'emailConfirmation.expirationDate': newExpiration,
    };

    const isUpdated: WithId<UserWithPasswordType> | null =
      await usersRepository.resendEmail(email, updateData);

    if (!isUpdated) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          {
            field: 'email',
            message: 'Email is already confirmed or does not exist',
          },
        ],
      };
    }

    try {
      await emailAdapter.sendEmail(
        email,
        newCode,
        emailExamples.registrationEmail,
      );
    } catch (e) {
      console.log(e);
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  },
  async login(
    dto: LoginDto,
    ip: string,
    title: string,
  ): Promise<AccessAndRefreshTokensType> {
    const user: WithId<UserWithPasswordType> | null =
      await usersRepository.findByLoginOrEmail(dto.loginOrEmail);

    const deviceId: string = randomUUID();

    if (!user || !user._id) {
      throw new UnauthorizedError('User not found', 'login');
    }

    const isValidatePassword: boolean = await hashAdapter.compare(
      user.password,
      dto.password,
    );

    if (!isValidatePassword) {
      throw new UnauthorizedError('User not found', 'login');
    }

    const accessToken: string = await jwtAdapter.createAccessToken(
      user._id.toString(),
    );
    const refreshToken: string = await jwtAdapter.createRefreshToken(
      user._id.toString(),
      deviceId,
    );

    let payload: JwtPayload;
    try {
      payload = jwtAdapter.verifyRefreshToken(refreshToken) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    if (
      !payload.exp ||
      !payload.userId ||
      !ObjectId.isValid(payload.userId) ||
      !payload.deviceId ||
      !payload.iat
    ) {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    const lastActiveDate = new Date(payload.iat * 1000);
    const expiresAt = new Date(payload.exp * 1000);

    const sessionDeviceData: CreateSessionDto = {
      userId: payload.userId,
      deviceId,
      ip,
      title,
      lastActiveDate,
      expiresAt,
    };

    await securityDevicesRepository.addDeviceSession(sessionDeviceData);

    return {
      accessToken,
      refreshToken,
    };
  },

  async refreshToken(
    oldRefreshToken: string,
    ip: string,
    title: string,
  ): Promise<Result<AccessAndRefreshTokensType | null>> {
    let oldPayload: JwtPayload;
    try {
      oldPayload = jwtAdapter.verifyRefreshToken(oldRefreshToken) as JwtPayload;
    } catch {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        data: null,
        extensions: [{ field: 'refreshToken', message: 'Unauthorized' }],
      };
      // throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    const userId: string = oldPayload.userId as string;
    const deviceId: string = oldPayload.deviceId as string;

    if (!oldPayload.userId || !oldPayload.deviceId || !oldPayload.exp) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        data: null,
        extensions: [{ field: 'refreshToken', message: 'Unauthorized' }],
      };
      // throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    const isBlacklisted: WithId<BlacklistType> | null =
      await blacklistRepository.isTokenBlacklisted(
        oldRefreshToken,
        userId,
        deviceId,
      );

    if (isBlacklisted) {
      // throw new UnauthorizedError('Unauthorized', 'refreshToken');
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        data: null,
        extensions: [{ field: 'refreshToken', message: 'Unauthorized' }],
      };
    }

    const isActiveSession: SecurityDevicesType | null =
      await securityDevicesRepository.findDeviceSessionByUserIdAndDeviceId(
        oldPayload.userId,
        oldPayload.deviceId,
      );

    if (!isActiveSession) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        data: null,
        extensions: [{ field: 'refreshToken', message: 'Unauthorized' }],
      };
    }

    const accessToken: string = await jwtAdapter.createAccessToken(userId);
    const refreshToken: string = await jwtAdapter.createRefreshToken(
      userId,
      deviceId,
    );

    let newPayload: JwtPayload = jwtAdapter.verifyRefreshToken(
      refreshToken,
    ) as JwtPayload;

    if (
      !newPayload.userId ||
      !newPayload.deviceId ||
      !newPayload.iat ||
      !newPayload.exp
    ) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        data: null,
        extensions: [{ field: 'refreshToken', message: 'Unauthorized' }],
      };
      // throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    const lastActiveDate = new Date(newPayload.iat * 1000);
    const expiresAt = new Date(newPayload.exp * 1000);

    const updatedSessionDate: UpdateSessionDTO = {
      ip,
      title,
      lastActiveDate,
      expiresAt,
    };

    await securityDevicesRepository.updateDeviceSession(
      newPayload.userId,
      newPayload.deviceId,
      updatedSessionDate,
    );

    const blackList: AddBlacklistDto = {
      token: oldRefreshToken,
      userId: userId,
      deviceId: deviceId,
      expiresAt: new Date(oldPayload.exp * 1000),
    };

    await blacklistRepository.addToBlacklist(blackList);

    return {
      status: ResultStatus.Success,
      data: {
        accessToken,
        refreshToken,
      },
      extensions: [],
    };
  },
  async logout(oldRefreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = jwtAdapter.verifyRefreshToken(oldRefreshToken) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }

    if (!payload.exp || !payload.userId || !payload.deviceId) {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }

    const userId: string = payload.userId;
    const deviceId: string = payload.deviceId;

    const isBlacklisted: WithId<BlacklistType> | null =
      await blacklistRepository.isTokenBlacklisted(
        oldRefreshToken,
        userId,
        deviceId,
      );

    if (isBlacklisted) {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }

    const blackList: AddBlacklistDto = {
      token: oldRefreshToken,
      userId: userId,
      deviceId: deviceId,
      expiresAt: new Date(payload.exp * 1000),
    };

    await blacklistRepository.addToBlacklist(blackList);

    const isRemovedSession: boolean =
      await securityDevicesRepository.removeDeviceSession(userId, deviceId);

    if (!isRemovedSession) {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }
  },
};
