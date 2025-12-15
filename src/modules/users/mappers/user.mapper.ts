import { ObjectId } from 'mongodb';
import { UserDbType } from '../type/user.type';
import { UserOutputType } from '../type/user-output.type';

export const userMapper = (user: UserDbType): UserOutputType => {
  return {
    id: new ObjectId(user._id).toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
