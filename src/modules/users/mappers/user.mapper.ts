import { ObjectId, WithId } from 'mongodb';
import { UserType } from '../type/user.type';

export const userMapper = (user: WithId<UserType>): UserType => {
  return {
    id: new ObjectId(user._id).toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
