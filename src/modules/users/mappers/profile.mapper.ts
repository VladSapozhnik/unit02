import { ProfileType } from '../type/profile.type';
import { UsersDocument } from '../entities/user.entity';

export const profileMapper = (user: UsersDocument): ProfileType => {
  return {
    email: user.email,
    login: user.login,
    userId: user._id.toString(),
  };
};
