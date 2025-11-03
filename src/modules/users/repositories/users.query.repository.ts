import { userCollection } from '../../../core/db/mango.db';
import { WithId } from 'mongodb';
import { UserType } from '../type/user.type';

export const usersQueryRepository = {
  async getAllUsers(): Promise<WithId<UserType>[]> {
    return userCollection.find().toArray();
  },
  async getUserByLoginOrEmail(login: string, email: string) {
    return userCollection.findOne({ $or: [{ login }, { email }] });
  },
  async getUserByLogin(login: string) {
    await userCollection.findOne({ login });
  },
  async getUserByEmail(email: string) {
    await userCollection.findOne({ email });
  },
};
