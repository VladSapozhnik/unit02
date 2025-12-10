import { injectable } from 'inversify';
import { PasswordRecoveryType } from '../types/password-recovery.type';
import { passwordRecoveryCollection } from '../../../core/db/mango.db';
import { InsertOneResult, WithId } from 'mongodb';

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
}
