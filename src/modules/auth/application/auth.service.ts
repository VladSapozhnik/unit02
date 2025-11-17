import { LoginDto } from '../dto/login.dto';
import { usersRepository } from '../../users/repositories/users.repository';
import { UserDbType, UserType } from '../../users/type/user.type';
import { hashService } from '../../../core/hash/hash.service';
import {
  CreateUserDto,
  CreateUserWithCreatedAtDto,
} from '../../users/dto/create-user.dto';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { WithId } from 'mongodb';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { generateId } from '../../../core/constants/generate-id';
import { add } from 'date-fns/add';
import { emailManager } from '../../../core/managers/email.manager';
import { usersService } from '../../users/application/users.service';

export const authService = {
  async registration(dto: CreateUserDto): Promise<string> {
    const hash: string = await hashService.hashPassword(dto.password);

    const randomUUID = generateId();

    const payload: CreateUserWithCreatedAtDto = {
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
      throw new BadRequestError('User already exists', 'user');
    }

    const id: string = await usersRepository.createUser(payload);

    try {
      await emailManager.sendEmailForRegistration(dto.email, randomUUID);
    } catch (e) {
      await usersService.removeUser(id);
      throw new BadRequestError(
        'registration failed code:' + e,
        'registration',
      );
    }

    return id;
  },
  async confirmEmail(code: string) {
    const user: WithId<UserType> | null =
      await usersRepository.findUserByCode(code);

    if (!user) {
      throw new BadRequestError('User already exists', 'user');
    }

    if (
      user.emailConfirmation.isConfirmed ||
      user.emailConfirmation.confirmationCode !== code ||
      user.emailConfirmation.expirationDate < new Date()
    ) {
      throw new BadRequestError('Bad code for registration', 'code');
    }

    await usersRepository.updateConfirmation(user._id.toString());
  },
  async login(dto: LoginDto): Promise<false | string> {
    const user: UserDbType | null = await usersRepository.findByLoginOrEmail(
      dto.loginOrEmail,
    );

    if (!user || !user._id) {
      return false;
    }

    const isValidatePassword: boolean = await hashService.compare(
      user.password,
      dto.password,
    );

    if (!isValidatePassword) {
      return false;
    }

    return user._id.toString();
  },
};
