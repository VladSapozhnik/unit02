import {
  CreateUserDto,
  CreateUserWithCreatedAtDto,
} from '../dto/create-user.dto';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { UserType } from '../type/user.type';
import { usersRepository } from '../repositories/users.repository';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { DeleteResult, WithId } from 'mongodb';
import { hashService } from '../../../core/hash/hash.service';

export const usersService = {
  async createUser(dto: CreateUserDto): Promise<string> {
    const hash: string = await hashService.hashPassword(dto.password);

    const payload: CreateUserWithCreatedAtDto = {
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
    const isRemoveUser: DeleteResult = await usersRepository.removeUser(id);

    return isRemoveUser.deletedCount === 1;
  },
};
