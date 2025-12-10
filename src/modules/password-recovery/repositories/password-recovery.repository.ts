import { injectable } from 'inversify';
import { PasswordRecoveryDBType } from '../types/password-recovery.type';
import { passwordRecoveryCollection } from '../../../core/db/mango.db';
import { InsertOneResult, ObjectId, UpdateResult, WithId } from 'mongodb';

@injectable()
export class PasswordRecoveryRepository {
  async addPasswordRecoveryCode(
    recovery: PasswordRecoveryDBType,
  ): Promise<string> {
    const result: InsertOneResult<PasswordRecoveryDBType> =
      await passwordRecoveryCollection.insertOne(recovery);

    return result.insertedId.toString() ?? null;
  }

  async getPasswordRecoveryByCode(
    recoveryCode: string,
  ): Promise<WithId<PasswordRecoveryDBType> | null> {
    return passwordRecoveryCollection.findOne({
      recoveryCode,
    });
  }

  async markAsUsedById(id: string): Promise<boolean> {
    const result: UpdateResult<PasswordRecoveryDBType> =
      await passwordRecoveryCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isUsed: true } },
      );

    return result.modifiedCount === 1;
  }
}
