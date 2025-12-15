import { ObjectId } from 'mongodb';

export class EmailConfirmation {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;

  constructor(
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean,
  ) {
    this.confirmationCode = confirmationCode;
    this.expirationDate = expirationDate;
    this.isConfirmed = isConfirmed;
  }
}

export class UserDbType {
  /**
   * Represents a user in the database
   */
  _id: ObjectId;
  login: string;
  email: string;
  password: string;
  createdAt: string;
  emailConfirmation: EmailConfirmation;
  constructor(
    _id: ObjectId,
    login: string,
    email: string,
    password: string,
    createdAt: string,
    emailConfirmation: EmailConfirmation,
  ) {
    this._id = _id;
    this.login = login;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.emailConfirmation = emailConfirmation;
  }
}
