import { hashAdapter } from '../../src/core/adapters/hash.adapter';
import { UsersRepository } from '../../src/modules/users/repositories/users.repository';
import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';
import { UsersModel } from '../../src/modules/users/entities/user.entity';

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

    const user = new UsersModel({
      login,
      email,
      password: hash,
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
    });

    await usersRepository.createUser(user);

    return user;
  },
};
