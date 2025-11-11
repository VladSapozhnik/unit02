import { UserType } from '../type/user.type';
import { WithId } from 'mongodb';
import { ProfileType } from '../type/profile.type';

export const profileMapper = (user: WithId<UserType>): ProfileType => {
  return {
    email: user.email,
    login: user.login,
    userId: user._id.toString(),
  };
};
