import {
  CreateUserDto,
  CreateUserWithCreatedAtDto,
} from '../dto/create-user.dto';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { UserType } from '../type/user.type';
import { usersRepository } from '../repositories/users.repository';
import { InsertOneResult, WithId } from 'mongodb';
import { hashPasswordHelper } from '../helpers/hash-password.helper';
import { usersQueryRepository } from '../repositories/users.query.repository';

export const usersService = {
  async createUser(dto: CreateUserDto): Promise<WithId<UserType>> {
    const hash: string = await hashPasswordHelper(dto.password);

    const payload: CreateUserWithCreatedAtDto = {
      ...dto,
      password: hash,
      createdAt: createdAtHelper,
    };

    // const existUser: WithId<UserType> | null =
    //   await usersQueryRepository.getUserByLoginOrEmail(dto.login, dto.email);
    //
    // if (!existUser) {
    //   return false;
    // }

    const result: InsertOneResult<WithId<UserType>> =
      await usersRepository.createUser(payload);

    return { _id: result.insertedId, ...payload };
  },
};
