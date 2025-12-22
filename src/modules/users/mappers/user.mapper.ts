import { Types } from 'mongoose';
import { UserOutputType } from '../type/user-output.type';
import { UsersDocument } from '../entities/user.entity';

export const userMapper = (user: UsersDocument): UserOutputType => {
  return {
    id: new Types.ObjectId(user._id).toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
};
