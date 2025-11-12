import { usersCollection } from '../../../core/db/mango.db';
import { UserDbType, UserType } from '../type/user.type';
import { DeleteResult, InsertOneResult, ObjectId, WithId } from 'mongodb';
import { CreateUserWithCreatedAtDto } from '../dto/create-user.dto';

export const usersRepository = {
  async createUser(dto: CreateUserWithCreatedAtDto): Promise<string> {
    const result: InsertOneResult<WithId<UserDbType>> =
      await usersCollection.insertOne(dto);

    return result.insertedId?.toString() ?? null;
  },
  async getUserById(id: ObjectId | string): Promise<WithId<UserType> | null> {
    const user: WithId<UserType> | null = await usersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return null;
    }

    return user;
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
