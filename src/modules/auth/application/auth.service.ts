import { LoginDto } from '../dto/login.dto';
import { usersRepository } from '../../users/repositories/users.repository';
import { UserDbType } from '../../users/type/user.type';
import * as argon2 from 'argon2';
import { ObjectId } from 'mongodb';

export const authService = {
  async login(dto: LoginDto): Promise<false | ObjectId> {
    const user: UserDbType | null = await usersRepository.findByLoginOrEmail(
      dto.loginOrEmail,
    );

    if (!user) {
      return false;
    }

    const isValidatePassword: boolean = await argon2.verify(
      user.password,
      dto.password,
    );

    if (!isValidatePassword) {
      return false;
    }

    return user._id;
  },
};
