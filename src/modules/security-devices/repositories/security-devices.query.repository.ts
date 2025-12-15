import { SecurityDevicesDBType } from '../types/security-devices.type';
import { securityDevicesCollection } from '../../../core/db/mango.db';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export class SecurityDevicesQueryRepository {
  async findDeviceSessionByUserId(
    userId: string,
  ): Promise<SecurityDevicesDBType[]> {
    return securityDevicesCollection
      .find({
        userId: new ObjectId(userId),
      })
      .toArray();
  }
}
