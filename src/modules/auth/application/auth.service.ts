import { LoginDto } from '../dto/login.dto';
import { usersRepository } from '../../users/repositories/users.repository';
import { UserType, UserWithPasswordType } from '../../users/type/user.type';
import { hashAdapter } from '../../../core/adapters/hash.adapter';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { WithId } from 'mongodb';
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
      currentRefreshToken: '',
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
  async login(dto: LoginDto): Promise<AccessAndRefreshTokensType> {
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

    await authService.saveRefreshToken(user._id.toString(), refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  },

  async saveRefreshToken(userId: string, refreshToken: string) {
    const isSaveRefreshToken: boolean = await usersRepository.saveRefreshToken(
      userId,
      refreshToken,
    );

    if (!isSaveRefreshToken) {
      throw new UnauthorizedError('User not found', 'auth');
    }
  },

  async refreshToken(
    oldRefreshToken: string,
  ): Promise<AccessAndRefreshTokensType> {
    if (!oldRefreshToken) {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    let payload: JwtPayload;
    try {
      payload = jwtAdapter.verifyRefreshToken(oldRefreshToken) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    const userId: string = payload.userId as string;
    const deviceId: string = payload.deviceId as string;

    const currentRefreshToken: string | null =
      await usersRepository.getRefreshTokenByUserId(userId);

    if (!payload.exp) {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    const blackList: BlacklistType = {
      token: oldRefreshToken,
      userId: userId,
      deviceId: deviceId,
      expiresAt: new Date(payload.exp * 1000),
    };

    await blacklistRepository.addToBlacklist(blackList);

    if (!currentRefreshToken || currentRefreshToken !== oldRefreshToken) {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }

    const accessToken: string = await jwtAdapter.createAccessToken(userId);
    const refreshToken: string = await jwtAdapter.createRefreshToken(
      userId,
      deviceId,
    );

    return {
      accessToken,
      refreshToken,
    };
  },
  async logout(oldRefreshToken: string) {
    if (!oldRefreshToken) {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }
    let payload: JwtPayload;
    try {
      payload = jwtAdapter.verifyRefreshToken(oldRefreshToken) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }

    const userId: string = payload.userId;

    const currentRefreshToken: string | null =
      await usersRepository.getRefreshTokenByUserId(userId);

    if (!currentRefreshToken || currentRefreshToken !== oldRefreshToken) {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }

    await authService.saveRefreshToken(userId, '');
  },
};
