import { SecurityDevicesType } from '../types/security-devices.type';
import { securityDevicesCollection } from '../../../core/db/mango.db';
import { ObjectId, WithId } from 'mongodb';

export const securityDevicesQueryRepository = {
  async findDeviceSessionByUserId(
    userId: string,
  ): Promise<WithId<SecurityDevicesType>[]> {
    return securityDevicesCollection
      .find({
        userId: new ObjectId(userId),
      })
      .toArray();
  },
};
