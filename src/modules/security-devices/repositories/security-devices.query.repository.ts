import { Types } from 'mongoose';
import { injectable } from 'inversify';
import {
  SecurityDevicesDocument,
  SecurityDevicesModel,
} from '../entities/security-devices.entity';

@injectable()
export class SecurityDevicesQueryRepository {
  async findDeviceSessionByUserId(
    userId: string,
  ): Promise<SecurityDevicesDocument[]> {
    return SecurityDevicesModel.find({
      userId: new Types.ObjectId(userId),
    });
  }
}
