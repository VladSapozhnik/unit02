import { hashAdapter } from '../../src/core/adapters/hash.adapter';
import { UsersRepository } from '../../src/modules/users/repositories/users.repository';
import { UserWithPasswordType } from '../../src/modules/users/type/user.type';
import { createdAtHelper } from '../../src/core/helpers/created-at.helper';
import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';

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

    const user: UserWithPasswordType = {
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

    return await usersRepository.createUser(user);
  },
};
