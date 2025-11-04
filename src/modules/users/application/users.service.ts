import {
  CreateUserDto,
  CreateUserWithCreatedAtAndSaltDto,
} from '../dto/create-user.dto';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { UserType } from '../type/user.type';
import { usersRepository } from '../repositories/users.repository';
import { InsertOneResult, WithId } from 'mongodb';
import { hashPasswordHelper } from '../helpers/hash-password.helper';
import bcrypt from 'bcrypt';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { usersQueryRepository } from '../repositories/users.query.repository';

export const usersService = {
  async createUser(dto: CreateUserDto): Promise<WithId<UserType>> {
    const passwordSalt: string = await bcrypt.genSalt(10);

    const hash: string = await hashPasswordHelper(dto.password, passwordSalt);

    const payload: CreateUserWithCreatedAtAndSaltDto = {
      ...dto,
      password: hash,
      passwordSalt,
      createdAt: createdAtHelper(),
    };

    const existUser: WithId<UserType> | null =
      await usersQueryRepository.getUserByLoginOrEmail(dto.login, dto.email);

    if (existUser) {
      throw new BadRequestError('User already exists', 'user');
    }

    const result: InsertOneResult<WithId<UserType>> =
      await usersRepository.createUser(payload);

    return { _id: result.insertedId, ...payload };
  },
};
