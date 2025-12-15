import { Types } from 'mongoose';

export class SecurityDevicesDBType {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  deviceId: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  expiresAt: Date;
  constructor(
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    deviceId: string,
    ip: string,
    title: string,
    lastActiveDate: Date,
    expiresAt: Date,
  ) {
    this._id = _id;
    this.userId = userId;
    this.deviceId = deviceId;
    this.ip = ip;
    this.title = title;
    this.lastActiveDate = lastActiveDate;
    this.expiresAt = expiresAt;
  }
}
