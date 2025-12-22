import { SecurityDevicesDBType } from '../types/security-devices.type';
import { SecurityDevicesModel } from '../../../core/db/mongo.db';
import { Types } from 'mongoose';
import { injectable } from 'inversify';

@injectable()
export class SecurityDevicesQueryRepository {
  async findDeviceSessionByUserId(
    userId: string,
  ): Promise<SecurityDevicesDBType[]> {
    return SecurityDevicesModel.find({
      userId: new Types.ObjectId(userId),
    }).lean();
  }
}
