import { Types } from 'mongoose';

export class PasswordRecoveryDBType {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  recoveryCode: string;
  expirationDate: Date;
  isUsed: boolean;
  // createdAt: Date;
  constructor(
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    recoveryCode: string,
    expirationDate: Date,
    isUsed: boolean,
  ) {
    this._id = _id;
    this.userId = userId;
    this.recoveryCode = recoveryCode;
    this.expirationDate = expirationDate;
    this.isUsed = isUsed;
  }
}
