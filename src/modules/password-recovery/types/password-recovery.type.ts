import { ObjectId } from 'mongodb';

export type PasswordRecoveryType = {
  _id?: ObjectId;
  userId: ObjectId;
  recoveryCode: string;
  expirationDate: Date;
  isUsed: boolean;
  // createdAt: Date;
};
