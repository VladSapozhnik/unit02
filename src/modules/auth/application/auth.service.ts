import { LoginDto } from '../dto/login.dto';
import { EmailConfirmation, UserDbType } from '../../users/type/user.type';
import { hashAdapter } from '../../../core/adapters/hash.adapter';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { ObjectId } from 'mongodb';
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
import { CreateSessionDto } from '../../security-devices/dto/create-session.dto';
import { SecurityDevicesDBType } from '../../security-devices/types/security-devices.type';
import { UpdateSessionDTO } from '../../security-devices/dto/update-session.dto';
import { inject, injectable } from 'inversify';
import { UsersRepository } from '../../users/repositories/users.repository';
import { SecurityDevicesRepository } from '../../security-devices/repositories/security-devices.repository';
import { PasswordRecoveryRepository } from '../../password-recovery/repositories/password-recovery.repository';
import { PasswordRecoveryDBType } from '../../password-recovery/types/password-recovery.type';

@injectable()
export class AuthService {
  constructor(
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @inject(SecurityDevicesRepository)
    private readonly securityDevicesRepository: SecurityDevicesRepository,
    @inject(PasswordRecoveryRepository)
    private readonly passwordRecoveryRepository: PasswordRecoveryRepository,
  ) {}

  async registration(dto: CreateUserDto): Promise<Result<UserDbType | null>> {
    const hash: string = await hashAdapter.hashPassword(dto.password);

    const randomUUID = generateId();

    const newUser: UserDbType = new UserDbType(
      new ObjectId(),
      dto.login,
      dto.email,
      hash,
      createdAtHelper(),
      new EmailConfirmation(
        randomUUID,
        add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        false,
      ),
    );

    const isUser: UserDbType | null =
      await this.usersRepository.getUserByLoginOrEmail(dto.login, dto.email);

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

    await this.usersRepository.createUser(newUser);

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
  }

  async confirmEmail(code: string): Promise<Result> {
    const user: UserDbType | null =
      await this.usersRepository.findUserByCode(code);

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

    await this.usersRepository.updateConfirmation(user._id.toString());

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async resendEmail(email: string): Promise<Result> {
    const newExpiration: Date = add(new Date(), { hours: 1, minutes: 30 });
    const newCode = generateId();

    const updateData: ResendEmailType = {
      'emailConfirmation.confirmationCode': newCode,
      'emailConfirmation.expirationDate': newExpiration,
    };

    const isUpdated: UserDbType | null = await this.usersRepository.resendEmail(
      email,
      updateData,
    );

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
  }

  async login(
    dto: LoginDto,
    ip: string,
    title: string,
  ): Promise<AccessAndRefreshTokensType> {
    const user: UserDbType | null =
      await this.usersRepository.findByLoginOrEmail(dto.loginOrEmail);

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

    const sessionDeviceData: CreateSessionDto = new CreateSessionDto(
      payload.userId,
      deviceId,
      ip,
      title,
      lastActiveDate,
      expiresAt,
    );

    await this.securityDevicesRepository.addDeviceSession(sessionDeviceData);

    return {
      accessToken,
      refreshToken,
    };
  }

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

    if (
      !oldPayload.userId ||
      !oldPayload.deviceId ||
      !oldPayload.exp ||
      !oldPayload.iat
    ) {
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

    const isActiveSession: SecurityDevicesDBType | null =
      await this.securityDevicesRepository.findDeviceSessionByUserIdAndDeviceId(
        oldPayload.userId,
        oldPayload.deviceId,
      );
    // Math.floor(
    if (
      !isActiveSession ||
      Math.floor(isActiveSession.lastActiveDate.getTime() / 1000) !==
        oldPayload.iat
    ) {
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

    const updatedSessionDate: UpdateSessionDTO = new UpdateSessionDTO(
      ip,
      title,
      lastActiveDate,
      expiresAt,
    );

    const isUpdatedSessions: boolean =
      await this.securityDevicesRepository.updateDeviceSession(
        newPayload.userId,
        newPayload.deviceId,
        updatedSessionDate,
      );

    if (!isUpdatedSessions) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        data: null,
        extensions: [{ field: 'refreshToken', message: 'Unauthorized' }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: {
        accessToken,
        refreshToken,
      },
      extensions: [],
    };
  }

  async logout(oldRefreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = jwtAdapter.verifyRefreshToken(oldRefreshToken) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }

    if (!payload.exp || !payload.userId || !payload.deviceId || !payload.iat) {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }

    const userId: string = payload.userId;
    const deviceId: string = payload.deviceId;

    const isActiveSession: SecurityDevicesDBType | null =
      await this.securityDevicesRepository.findDeviceSessionByUserIdAndDeviceId(
        payload.userId,
        payload.deviceId,
      );
    // Math.floor(
    if (
      !isActiveSession ||
      Math.floor(isActiveSession.lastActiveDate.getTime() / 1000) !==
        payload.iat
    ) {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }

    const isRemovedSession: boolean =
      await this.securityDevicesRepository.removeDeviceSession(
        userId,
        deviceId,
      );

    if (!isRemovedSession) {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }
  }

  async passwordRecovery(email: string): Promise<Result> {
    const randomUUID = generateId();

    const existUser: UserDbType | null =
      await this.usersRepository.findUserByEmail(email);

    if (existUser) {
      const recoveryData: PasswordRecoveryDBType = {
        _id: new ObjectId(),
        userId: existUser._id,
        recoveryCode: randomUUID,
        expirationDate: add(new Date(), {
          minutes: 30,
        }),
        isUsed: false,
      };

      try {
        await emailAdapter.sendEmail(
          email,
          randomUUID,
          emailExamples.passwordRecovery,
        );

        await this.passwordRecoveryRepository.addPasswordRecoveryCode(
          recoveryData,
        );
      } catch (e) {
        console.log(e);
      }
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

  async newPassword(newPassword: string, code: string): Promise<Result> {
    const isPasswordRecovery: PasswordRecoveryDBType | null =
      await this.passwordRecoveryRepository.getPasswordRecoveryByCode(code);

    if (
      !isPasswordRecovery ||
      isPasswordRecovery.expirationDate < new Date() ||
      isPasswordRecovery.isUsed
    ) {
      // throw new BadRequestError('Code is invalid', 'recoveryCode');

      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [{ field: 'recoveryCode', message: 'Code is invalid' }],
      };
    }

    const hash: string = await hashAdapter.hashPassword(newPassword);

    const isUpdate: boolean = await this.usersRepository.updateUserPasswordById(
      isPasswordRecovery.userId.toString(),
      hash,
    );

    if (!isUpdate) {
      // throw new BadRequestError('Code is invalid', 'recoveryCode');
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [{ field: 'recoveryCode', message: 'Code is invalid' }],
      };
    }

    await this.passwordRecoveryRepository.markAsUsedById(
      isPasswordRecovery._id.toString(),
    );

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
