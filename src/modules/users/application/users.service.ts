import { CreateUserDto } from '../dto/create-user.dto';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { UserDbType, UserType } from '../type/user.type';
import { usersRepository } from '../repositories/users.repository';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { hashService } from '../../../core/hash/hash.service';
import { WithId } from 'mongodb';

export const usersService = {
  async createUser(dto: CreateUserDto): Promise<string> {
    const hash: string = await hashService.hashPassword(dto.password);

    const payload: UserDbType = {
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

    return usersRepository.createUser(payload);
  },
  async removeUser(id: string): Promise<boolean> {
    return await usersRepository.removeUser(id);
  },
};
