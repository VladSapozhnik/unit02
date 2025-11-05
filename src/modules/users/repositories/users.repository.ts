import { userCollection } from '../../../core/db/mango.db';
import { UserDbType } from '../type/user.type';
import { DeleteResult, InsertOneResult, ObjectId, WithId } from 'mongodb';
import { CreateUserWithCreatedAtDto } from '../dto/create-user.dto';

export const usersRepository = {
  async createUser(
    dto: CreateUserWithCreatedAtDto,
  ): Promise<InsertOneResult<WithId<UserDbType>>> {
    return userCollection.insertOne(dto);
  },
  async getUserByLoginOrEmail(login: string, email: string) {
    return userCollection.findOne({ $or: [{ login }, { email }] });
  },
  async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<UserDbType> | null> {
    return userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },
  async removeUser(id: string): Promise<DeleteResult> {
    return userCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
