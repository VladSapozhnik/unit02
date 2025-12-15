import { SecurityDevicesDBType } from '../types/security-devices.type';
import { SecurityDevicesModel } from '../../../core/db/mango.db';
import { Types, DeleteResult, UpdateResult } from 'mongoose';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDTO } from '../dto/update-session.dto';
import { injectable } from 'inversify';

@injectable()
export class SecurityDevicesRepository {
  async addDeviceSession(data: CreateSessionDto): Promise<string | null> {
    const result: SecurityDevicesDBType = await SecurityDevicesModel.create({
      _id: new Types.ObjectId(),
      ...data,
      userId: new Types.ObjectId(data.userId),
    });

    return result._id.toString();
  }

  async updateDeviceSession(
    userId: string,
    deviceId: string,
    data: UpdateSessionDTO,
  ): Promise<boolean> {
    const result: UpdateResult = await SecurityDevicesModel.updateOne(
      {
        userId: new Types.ObjectId(userId),
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
    return SecurityDevicesModel.findOne({
      userId: new Types.ObjectId(userId),
      deviceId,
    }).lean();
  }

  async findDeviceSessionByDeviceId(
    deviceId: string,
  ): Promise<SecurityDevicesDBType | null> {
    return SecurityDevicesModel.findOne({
      deviceId,
    }).lean();
  }

  async removeDeviceSession(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result: DeleteResult = await SecurityDevicesModel.deleteOne({
      userId: new Types.ObjectId(userId),
      deviceId,
    });

    return result.deletedCount === 1;
  }

  async removeOtherDeviceSession(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result: DeleteResult = await SecurityDevicesModel.deleteMany({
      userId: new Types.ObjectId(userId),
      deviceId: { $ne: deviceId },
    });

    return result.deletedCount > 0;
  }
}
