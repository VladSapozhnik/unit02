import { usersCollection } from '../../../core/db/mango.db';
import { UserDbType } from '../type/user.type';
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { ResendEmailType } from '../../auth/type/resend-email.type';
import { injectable } from 'inversify';

@injectable()
export class UsersRepository {
  async createUser(dto: UserDbType): Promise<string> {
    const result: InsertOneResult<UserDbType> =
      await usersCollection.insertOne(dto);

    return result.insertedId?.toString() ?? null;
  }

  async getUserById(id: ObjectId | string): Promise<UserDbType | null> {
    const user: UserDbType | null = await usersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findUserByCode(code: string): Promise<UserDbType | null> {
    return await usersCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async getUserByLoginOrEmail(login: string, email: string) {
    return usersCollection.findOne({ $or: [{ login }, { email }] });
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbType | null> {
    return usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async findUserByEmail(email: string) {
    return usersCollection.findOne({ email });
  }

  async updateUserPasswordById(id: string, newPasswordHash: string) {
    const result: UpdateResult<UserDbType> = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { password: newPasswordHash } },
    );

    return result.matchedCount === 1;
  }

  async updateConfirmation(id: string): Promise<boolean> {
    const result: UpdateResult<UserDbType> = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );

    return result.modifiedCount === 1;
  }

  async resendEmail(
    email: string,
    updateData: ResendEmailType,
  ): Promise<UserDbType | null> {
    return usersCollection.findOneAndUpdate(
      {
        email,
        'emailConfirmation.isConfirmed': false,
      },
      {
        $set: updateData,
      },
      { returnDocument: 'after' },
    );
  }

  async removeUser(id: string): Promise<boolean> {
    const result: DeleteResult = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return result.deletedCount === 1;
  }
}
