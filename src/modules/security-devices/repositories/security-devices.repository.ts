import { SecurityDevicesDBType } from '../types/security-devices.type';
import { securityDevicesCollection } from '../../../core/db/mango.db';
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDTO } from '../dto/update-session.dto';
import { injectable } from 'inversify';

@injectable()
export class SecurityDevicesRepository {
  async addDeviceSession(data: CreateSessionDto): Promise<string | null> {
    const result: InsertOneResult<SecurityDevicesDBType> =
      await securityDevicesCollection.insertOne({
        _id: new ObjectId(),
        ...data,
        userId: new ObjectId(data.userId),
      });

    return result.insertedId.toString() ?? null;
  }

  async updateDeviceSession(
    userId: string,
    deviceId: string,
    data: UpdateSessionDTO,
  ): Promise<boolean> {
    const result: UpdateResult<SecurityDevicesDBType> =
      await securityDevicesCollection.updateOne(
        {
          userId: new ObjectId(userId),
          deviceId,
        },
        { $set: data },
      );

    return result.matchedCount === 1;
  }

  async findDeviceSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<SecurityDevicesDBType | null> {
    return securityDevicesCollection.findOne({
      userId: new ObjectId(userId),
      deviceId,
    });
  }

  async findDeviceSessionByDeviceId(
    deviceId: string,
  ): Promise<SecurityDevicesDBType | null> {
    return securityDevicesCollection.findOne({
      deviceId,
    });
  }

  async removeDeviceSession(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result: DeleteResult = await securityDevicesCollection.deleteOne({
      userId: new ObjectId(userId),
      deviceId,
    });

    return result.deletedCount === 1;
  }

  async removeOtherDeviceSession(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result: DeleteResult = await securityDevicesCollection.deleteMany({
      userId: new ObjectId(userId),
      deviceId: { $ne: deviceId },
    });

    return result.deletedCount > 0;
  }
}

// export const securityDevicesRepository = {
//   async addDeviceSession(data: CreateSessionDto): Promise<string | null> {
//     const result: InsertOneResult<WithId<SecurityDevicesType>> =
//       await securityDevicesCollection.insertOne({
//         ...data,
//         userId: new ObjectId(data.userId),
//       });
//
//     return result.insertedId.toString() ?? null;
//   },
//
//   async updateDeviceSession(
//     userId: string,
//     deviceId: string,
//     data: UpdateSessionDTO,
//   ): Promise<boolean> {
//     const result: UpdateResult<WithId<SecurityDevicesType>> =
//       await securityDevicesCollection.updateOne(
//         {
//           userId: new ObjectId(userId),
//           deviceId,
//         },
//         { $set: data },
//       );
//
//     return result.matchedCount === 1;
//   },
//
//   async findDeviceSessionByUserIdAndDeviceId(
//     userId: string,
//     deviceId: string,
//   ): Promise<WithId<SecurityDevicesType> | null> {
//     return securityDevicesCollection.findOne({
//       userId: new ObjectId(userId),
//       deviceId,
//     });
//   },
//
//   async findDeviceSessionByDeviceId(
//     deviceId: string,
//   ): Promise<WithId<SecurityDevicesType> | null> {
//     return securityDevicesCollection.findOne({
//       deviceId,
//     });
//   },
//   async removeDeviceSession(
//     userId: string,
//     deviceId: string,
//   ): Promise<boolean> {
//     const result: DeleteResult = await securityDevicesCollection.deleteOne({
//       userId: new ObjectId(userId),
//       deviceId,
//     });
//
//     return result.deletedCount === 1;
//   },
//
//   async removeOtherDeviceSession(
//     userId: string,
//     deviceId: string,
//   ): Promise<boolean> {
//     const result: DeleteResult = await securityDevicesCollection.deleteMany({
//       userId: new ObjectId(userId),
//       deviceId: { $ne: deviceId },
//     });
//
//     return result.deletedCount > 0;
//   },
// };
