import { userCollection } from '../../../core/db/mango.db';
import { UserType } from '../type/user.type';
import { DeleteResult, InsertOneResult, ObjectId } from 'mongodb';
import { CreateUserWithCreatedAtAndSaltDto } from '../dto/create-user.dto';

export const usersRepository = {
  async createUser(
    dto: CreateUserWithCreatedAtAndSaltDto,
  ): Promise<InsertOneResult<UserType>> {
    return userCollection.insertOne(dto);
  },
  async removeUser(id: string): Promise<DeleteResult> {
    return userCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
