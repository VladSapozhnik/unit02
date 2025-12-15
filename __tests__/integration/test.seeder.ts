import { hashAdapter } from '../../src/core/adapters/hash.adapter';
import { UsersRepository } from '../../src/modules/users/repositories/users.repository';
import { UserDbType } from '../../src/modules/users/type/user.type';
import { createdAtHelper } from '../../src/core/helpers/created-at.helper';
import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';
import { Types } from 'mongoose';

export type RegisterUserPayloadType = {
  login: string;
  password: string;
  email: string;
  code?: string;
  expirationDate?: Date;
  isConfirmed?: boolean;
};

export const testSeeder = {
  createUserDto() {
    return {
      login: 'TX17Vq',
      password: 'string',
      email: 'example@example.com',
    };
  },

  async insertUser({
    login,
    password,
    email,
    code,
    expirationDate,
    isConfirmed,
  }: RegisterUserPayloadType) {
    const usersRepository = new UsersRepository();

    const hash: string = await hashAdapter.hashPassword(password);

    const user: UserDbType = {
      _id: new Types.ObjectId(),
      login,
      email,
      password: hash,
      createdAt: createdAtHelper(),
      emailConfirmation: {
        confirmationCode: code ?? randomUUID(),
        expirationDate:
          expirationDate ??
          add(new Date(), {
            hours: 1,
            minutes: 30,
          }),
        isConfirmed: isConfirmed ?? false,
      },
    };

    await usersRepository.createUser(user);

    return user;
  },
};
