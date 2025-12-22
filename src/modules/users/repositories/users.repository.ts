import { Types, DeleteResult, UpdateResult } from 'mongoose';
import { ResendEmailType } from '../../auth/type/resend-email.type';
import { injectable } from 'inversify';
import { UsersDocument, UsersModel } from '../entities/user.entity';

@injectable()
export class UsersRepository {
  async createUser(user: UsersDocument): Promise<string> {
    // const result: UserDbType = await UsersModel.create(dto);
    const result: UsersDocument = await user.save();
    return result._id.toString();
  }

  async getUserById(id: string): Promise<UsersDocument | null> {
    const user: UsersDocument | null = await UsersModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findUserByCode(code: string): Promise<UsersDocument | null> {
    return UsersModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async getUserByLoginOrEmail(login: string, email: string) {
    return UsersModel.findOne({ $or: [{ login }, { email }] });
  }

  async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UsersDocument | null> {
    return UsersModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async findUserByEmail(email: string): Promise<UsersDocument | null> {
    return UsersModel.findOne({ email });
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

  async updateConfirmation(user: UsersDocument): Promise<string> {
    const result: UsersDocument = await user.save();

    return result._id.toString();
  }

  async resendEmail(
    email: string,
    updateData: ResendEmailType,
  ): Promise<UsersDocument | null> {
    return UsersModel.findOneAndUpdate(
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
    const result: DeleteResult = await UsersModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return result.deletedCount === 1;
  }
}
