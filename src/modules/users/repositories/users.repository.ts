import { usersCollection } from '../../../core/db/mango.db';
import { UserType, UserWithPasswordType } from '../type/user.type';
import {
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';
import { ResendEmailType } from '../../auth/type/resend-email.type';

export const usersRepository = {
  async createUser(dto: UserWithPasswordType): Promise<string> {
    const result: InsertOneResult<WithId<UserWithPasswordType>> =
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
  async findUserByCode(code: string): Promise<WithId<UserType> | null> {
    return await usersCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  },
  async getUserByLoginOrEmail(login: string, email: string) {
    return usersCollection.findOne({ $or: [{ login }, { email }] });
  },
  async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<UserWithPasswordType> | null> {
    return usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },
  async updateConfirmation(id: string): Promise<boolean> {
    const result: UpdateResult<WithId<UserWithPasswordType>> =
      await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { 'emailConfirmation.isConfirmed': true } },
      );

    return result.modifiedCount === 1;
  },
  async resendEmail(
    email: string,
    updateData: ResendEmailType,
  ): Promise<WithId<UserWithPasswordType> | null> {
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
  },
  async removeUser(id: string): Promise<boolean> {
    const result: DeleteResult = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return result.deletedCount === 1;
  },
};
