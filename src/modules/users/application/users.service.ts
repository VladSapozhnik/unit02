import {
  CreateUserDto,
  CreateUserWithCreatedAtDto,
} from '../dto/create-user.dto';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { UserType } from '../type/user.type';
import { usersRepository } from '../repositories/users.repository';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { DeleteResult, InsertOneResult, ObjectId, WithId } from 'mongodb';
import * as argon2 from 'argon2';

export const usersService = {
  async createUser(dto: CreateUserDto): Promise<ObjectId> {
    const hash: string = await argon2.hash(dto.password);

    const payload: CreateUserWithCreatedAtDto = {
      ...dto,
      password: hash,
      createdAt: createdAtHelper(),
    };

    const isUser: WithId<UserType> | null =
      await usersRepository.getUserByLoginOrEmail(dto.login, dto.email);

    if (isUser) {
      throw new BadRequestError('User already exists', 'user');
    }

    const result: InsertOneResult<WithId<UserType>> =
      await usersRepository.createUser(payload);

    return result.insertedId;
  },
  async removeUser(id: string): Promise<boolean> {
    const isRemoveUser: DeleteResult = await usersRepository.removeUser(id);

    return isRemoveUser.deletedCount === 1;
  },
};
