import { ObjectId } from 'mongodb';

export type SecurityDevicesType = {
  _id?: ObjectId;
  userId: string;
  deviceId: string;
  ip: string;
  title: string;
  issuedAt: Date;
  expiresAt: Date;
};
