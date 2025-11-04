import { userCollection } from '../../../core/db/mango.db';
import { UserType } from '../type/user.type';
import { DeleteResult, InsertOneResult, ObjectId } from 'mongodb';
import { CreateUserWithCreatedAtDto } from '../dto/create-user.dto';

export const usersRepository = {
  async createUser(
    dto: CreateUserWithCreatedAtDto,
  ): Promise<InsertOneResult<UserType>> {
    return userCollection.insertOne(dto);
  },
  async getUserByLoginOrEmail(login: string, email: string) {
    return userCollection.findOne({ $or: [{ login }, { email }] });
  },
  async removeUser(id: string): Promise<DeleteResult> {
    return userCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
