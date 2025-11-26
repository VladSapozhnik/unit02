import { ObjectId } from 'mongodb';

export type BlacklistType = {
  _id?: ObjectId;
  token: string;
  deviceId: string;
  userId: string;
  expiresAt: Date;
};
