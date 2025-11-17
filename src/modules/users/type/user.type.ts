import { ObjectId } from 'mongodb';

export type UserType = {
  /**
   * Represents a user object exposed to the client
   */
  id?: string;
  login: string;
  email: string;
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
};

export type UserDbType = {
  /**
   * Represents a user in the database
   */
  _id?: ObjectId;
  login: string;
  email: string;
  password: string;
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
};
