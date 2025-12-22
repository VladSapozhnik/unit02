import { injectable } from 'inversify';
import {
  PasswordRecoveryDocument,
  PasswordRecoveryModel,
} from '../entities/password-recovery.entity';

@injectable()
export class PasswordRecoveryRepository {
  async addPasswordRecoveryCode(
    passwordRecovery: PasswordRecoveryDocument,
  ): Promise<string> {
    await passwordRecovery.save();

    return passwordRecovery._id.toString();
  }

  async getPasswordRecoveryByCode(
    recoveryCode: string,
  ): Promise<PasswordRecoveryDocument | null> {
    return PasswordRecoveryModel.findOne({
      recoveryCode,
    });
  }

  async markAsUsedById(
    passwordRecovery: PasswordRecoveryDocument,
  ): Promise<string> {
    await passwordRecovery.save();

    return passwordRecovery._id.toString();
  }
}
