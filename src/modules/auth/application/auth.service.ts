import { LoginDto } from '../dto/login.dto';
import { usersRepository } from '../../users/repositories/users.repository';
import { UserDbType } from '../../users/type/user.type';
import { hashService } from '../../../core/hash/hash.service';

export const authService = {
  async login(dto: LoginDto): Promise<false | string> {
    const user: UserDbType | null = await usersRepository.findByLoginOrEmail(
      dto.loginOrEmail,
    );

    if (!user || !user._id) {
      return false;
    }

    const isValidatePassword: boolean = await hashService.compare(
      user.password,
      dto.password,
    );

    if (!isValidatePassword) {
      return false;
    }

    return user._id.toString();
  },
};
