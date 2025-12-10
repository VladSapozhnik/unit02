import { ObjectId } from 'mongodb';

export class PasswordRecoveryType {
  _id: ObjectId;
  userId: ObjectId;
  recoveryCode: string;
  expirationDate: Date;
  isUsed: boolean;
  // createdAt: Date;
  constructor(
    _id: ObjectId,
    userId: ObjectId,
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
