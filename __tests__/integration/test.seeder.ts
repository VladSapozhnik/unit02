import { hashAdapter } from '../../src/core/adapters/hash.adapter';
import { usersRepository } from '../../src/modules/users/repositories/users.repository';
import { UserDbType } from '../../src/modules/users/type/user.type';
import { createdAtHelper } from '../../src/core/helpers/created-at.helper';
import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';

export const testSeeder = {
  createUserDto() {
    return {
      login: 'TX17Vq',
      password: 'string',
      email: 'example@example.com',
    };
  },

  async insertUser({ login, password, email }: CreateUserDto) {
    const hash: string = await hashAdapter.hashPassword(password);

    const user: UserDbType = {
      login,
      email,
      password: hash,
      createdAt: createdAtHelper(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    };

    return await usersRepository.createUser(user);
  },
};
