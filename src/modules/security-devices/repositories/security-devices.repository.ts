import { Types, DeleteResult, UpdateResult } from 'mongoose';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDTO } from '../dto/update-session.dto';
import { injectable } from 'inversify';
import {
  SecurityDevicesDocument,
  SecurityDevicesModel,
} from '../entities/security-devices.entity';

@injectable()
export class SecurityDevicesRepository {
  async addDeviceSession(
    device: SecurityDevicesDocument,
  ): Promise<string | null> {
    await device.save();

    return device._id.toString();
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
  ): Promise<SecurityDevicesDocument | null> {
    return SecurityDevicesModel.findOne({
      userId: new Types.ObjectId(userId),
      deviceId,
    });
  }

  async findDeviceSessionByDeviceId(
    deviceId: string,
  ): Promise<SecurityDevicesDocument | null> {
    return SecurityDevicesModel.findOne({
      deviceId,
    });
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
