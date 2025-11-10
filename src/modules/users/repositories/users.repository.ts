import { usersCollection } from '../../../core/db/mango.db';
import { UserDbType, UserType } from '../type/user.type';
import { DeleteResult, InsertOneResult, ObjectId, WithId } from 'mongodb';
import { CreateUserWithCreatedAtDto } from '../dto/create-user.dto';
import { userMapper } from '../mappers/user.mapper';

export const usersRepository = {
  async createUser(
    dto: CreateUserWithCreatedAtDto,
  ): Promise<InsertOneResult<WithId<UserDbType>>> {
    return usersCollection.insertOne(dto);
  },
  async getUserById(id: ObjectId | string): Promise<UserType | null> {
    const user: WithId<UserType> | null = await usersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return null;
    }

    return userMapper(user);
  },
  async getUserByLoginOrEmail(login: string, email: string) {
    return usersCollection.findOne({ $or: [{ login }, { email }] });
  },
  async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<UserDbType> | null> {
    return usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },
  async removeUser(id: string): Promise<DeleteResult> {
    return usersCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
