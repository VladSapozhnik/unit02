import { CreateUserDto } from '../dto/create-user.dto';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { UserType, UserWithPasswordType } from '../type/user.type';
import { usersRepository } from '../repositories/users.repository';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { hashAdapter } from '../../../core/adapters/hash.adapter';
import { WithId } from 'mongodb';
import { HTTP_STATUS } from '../../../core/enums/http-status.enum';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';

export const usersService = {
  async createUser(dto: CreateUserDto): Promise<string> {
    const hash: string = await hashAdapter.hashPassword(dto.password);

    const newUser: UserWithPasswordType = {
      ...dto,
      password: hash,
      createdAt: createdAtHelper(),
      emailConfirmation: {
        confirmationCode: '',
        expirationDate: new Date(),
        isConfirmed: true,
      },
    };

    const isUser: WithId<UserType> | null =
      await usersRepository.getUserByLoginOrEmail(dto.login, dto.email);

    if (isUser) {
      throw new BadRequestError('User already exists', 'user');
    }

    return usersRepository.createUser(newUser);
  },
  async removeUser(id: string) {
    const isRemove: boolean = await usersRepository.removeUser(id);

    if (!isRemove) {
      throw new NotFoundError('User is not found!', 'user');
    }
  },
};
