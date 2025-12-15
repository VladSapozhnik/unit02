import { injectable } from 'inversify';
import { PasswordRecoveryDBType } from '../types/password-recovery.type';
import { PasswordRecoveryModel } from '../../../core/db/mango.db';
import { Types, UpdateResult } from 'mongoose';

@injectable()
export class PasswordRecoveryRepository {
  async addPasswordRecoveryCode(
    recovery: PasswordRecoveryDBType,
  ): Promise<string> {
    const result: PasswordRecoveryDBType =
      await PasswordRecoveryModel.create(recovery);

    return result._id.toString();
  }

  async getPasswordRecoveryByCode(
    recoveryCode: string,
  ): Promise<PasswordRecoveryDBType | null> {
    return PasswordRecoveryModel.findOne({
      recoveryCode,
    }).lean();
  }

  async markAsUsedById(id: string): Promise<boolean> {
    const result: UpdateResult = await PasswordRecoveryModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { isUsed: true } },
    );

    return result.modifiedCount === 1;
  }
}
