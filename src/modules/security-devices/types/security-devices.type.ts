import { ObjectId } from 'mongodb';

export type SecurityDevicesType = {
  _id?: ObjectId;
  userId: ObjectId;
  deviceId: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  expiresAt: Date;
};
