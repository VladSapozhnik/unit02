import { ObjectId, WithId } from 'mongodb';
import { UserType } from '../type/user.type';
import { UserOutputType } from '../type/user-output.type';

export const userMapper = (user: WithId<UserType>): UserOutputType => {
  return {
    id: new ObjectId(user._id).toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
