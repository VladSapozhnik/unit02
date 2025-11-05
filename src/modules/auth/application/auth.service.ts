import { LoginDto } from '../dto/login.dto';
import { usersRepository } from '../../users/repositories/users.repository';
import { UserDbType } from '../../users/type/user.type';
import * as argon2 from 'argon2';

export const authService = {
  async login(dto: LoginDto): Promise<boolean> {
    const user: UserDbType | null = await usersRepository.findByLoginOrEmail(
      dto.loginOrEmail,
    );

    if (!user) {
      return false;
    }

    return argon2.verify(user.password, dto.password);
  },
};
