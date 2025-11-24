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
  async login(dto: LoginDto): Promise<AccessAndRefreshTokensType> {
    const user: WithId<UserWithPasswordType> | null =
      await usersRepository.findByLoginOrEmail(dto.loginOrEmail);

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
    );

    return {
      accessToken,
      refreshToken,
    };
  },
};
