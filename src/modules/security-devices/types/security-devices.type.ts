import { ObjectId } from 'mongodb';

// export type SecurityDevicesType = {
//   _id?: ObjectId;
//   userId: ObjectId;
//   deviceId: string;
//   ip: string;
//   title: string;
//   lastActiveDate: Date;
//   expiresAt: Date;
// };

export class SecurityDevicesType {
  _id?: ObjectId;
  userId: ObjectId;
  deviceId: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  expiresAt: Date;
  constructor(
    userId: ObjectId,
    deviceId: string,
    ip: string,
    title: string,
    lastActiveDate: Date,
    expiresAt: Date,
  ) {
    this.userId = userId;
    this.deviceId = deviceId;
    this.ip = ip;
    this.title = title;
    this.lastActiveDate = lastActiveDate;
    this.expiresAt = expiresAt;
  }
}
