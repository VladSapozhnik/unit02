import { UserDbType } from '../type/user.type';
import { ProfileType } from '../type/profile.type';

export const profileMapper = (user: UserDbType): ProfileType => {
  return {
    email: user.email,
    login: user.login,
    userId: user._id.toString(),
  };
};
