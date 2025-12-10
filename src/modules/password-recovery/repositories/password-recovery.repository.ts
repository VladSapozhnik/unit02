import { injectable } from 'inversify';
import { PasswordRecoveryType } from '../types/password-recovery.type';
import { passwordRecoveryCollection } from '../../../core/db/mango.db';
import { InsertOneResult, ObjectId, UpdateResult, WithId } from 'mongodb';

@injectable()
export class PasswordRecoveryRepository {
  async addPasswordRecoveryCode(
    recovery: PasswordRecoveryType,
  ): Promise<string> {
    const result: InsertOneResult<PasswordRecoveryType> =
      await passwordRecoveryCollection.insertOne(recovery);

    return result.insertedId.toString() ?? null;
  }

  async getPasswordRecoveryByCode(
    recoveryCode: string,
  ): Promise<WithId<PasswordRecoveryType> | null> {
    return passwordRecoveryCollection.findOne({
      recoveryCode,
    });
  }

  async markAsUsedById(id: string): Promise<boolean> {
    const result: UpdateResult<PasswordRecoveryType> =
      await passwordRecoveryCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isUsed: true } },
      );

    return result.modifiedCount === 1;
  }
}
