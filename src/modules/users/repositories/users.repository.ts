import { UsersModel } from '../../../core/db/mango.db';
import { UserDbType } from '../type/user.type';
import { Types, DeleteResult, UpdateResult } from 'mongoose';
import { ResendEmailType } from '../../auth/type/resend-email.type';
import { injectable } from 'inversify';

@injectable()
export class UsersRepository {
  async createUser(dto: UserDbType): Promise<string> {
    const result: UserDbType = await UsersModel.create(dto);

    return result._id.toString();
  }

  async getUserById(id: string): Promise<UserDbType | null> {
    const user: UserDbType | null = await UsersModel.findOne({
      _id: new Types.ObjectId(id),
    }).lean();

    if (!user) {
      return null;
    }

    return user;
  }

  async findUserByCode(code: string): Promise<UserDbType | null> {
    return UsersModel.findOne({
      'emailConfirmation.confirmationCode': code,
    }).lean();
  }

  async getUserByLoginOrEmail(login: string, email: string) {
    return UsersModel.findOne({ $or: [{ login }, { email }] }).lean();
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbType | null> {
    return UsersModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    }).lean();
  }

  async findUserByEmail(email: string): Promise<UserDbType | null> {
    return UsersModel.findOne({ email }).lean();
  }

  async updateUserPasswordById(
    id: string,
    newPasswordHash: string,
  ): Promise<boolean> {
    const result: UpdateResult = await UsersModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { password: newPasswordHash } },
    );

    return result.matchedCount === 1;
  }

  async updateConfirmation(id: string): Promise<boolean> {
    const result: UpdateResult = await UsersModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );

    return result.modifiedCount === 1;
  }

  async resendEmail(
    email: string,
    updateData: ResendEmailType,
  ): Promise<UserDbType | null> {
    return UsersModel.findOneAndUpdate(
      {
        email,
        'emailConfirmation.isConfirmed': false,
      },
      {
        $set: updateData,
      },
      { returnDocument: 'after' },
    ).lean();
  }

  async removeUser(id: string): Promise<boolean> {
    const result: DeleteResult = await UsersModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return result.deletedCount === 1;
  }
}
