import { SecurityDevicesType } from '../types/security-devices.type';
import { securityDevicesCollection } from '../../../core/db/mango.db';
import { ObjectId, WithId } from 'mongodb';
import { securityDevicesMapper } from '../mappers/security-devices.mapper';
import { SecurityDevicesOutputType } from '../types/security-devices-output.type';

export const securityDevicesQueryRepository = {
  async findDeviceSessionByUserId(
    userId: string,
  ): Promise<SecurityDevicesOutputType[]> {
    const result: WithId<SecurityDevicesType>[] =
      await securityDevicesCollection
        .find({
          userId: new ObjectId(userId),
        })
        .toArray();

    return result.map(securityDevicesMapper);
  },
};
