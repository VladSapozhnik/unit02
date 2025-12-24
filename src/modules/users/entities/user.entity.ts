import { HydratedDocument, model, Model, Schema } from 'mongoose';

const USER_COLLECTION_NAME = 'users';

type EmailConfirmation = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export type UsersType = {
  /**
   * Represents a user in the database
   */
  login: string;
  email: string;
  password: string;
  createdAt: Date;
  emailConfirmation: EmailConfirmation;
};

const emailConfirmation = new Schema<EmailConfirmation>(
  {
    confirmationCode: { type: String, required: true, min: 1, max: 255 },
    expirationDate: { type: Date, required: true, min: 1, max: 255 },
    isConfirmed: { type: Boolean, default: false },
  },
  { _id: false },
);

export const usersSchema = new Schema<UsersType>(
  {
    login: { type: String, required: true, min: 1, max: 255, unique: true },
    email: { type: String, required: true, min: 1, max: 255, unique: true },
    password: { type: String, required: true, min: 1, max: 255 },
    emailConfirmation: emailConfirmation,
  },
  { timestamps: true },
);

type UsersModelType = Model<UsersType>;

export type UsersDocument = HydratedDocument<UsersType>;

export const UsersModel: UsersModelType = model<UsersType, UsersModelType>(
  USER_COLLECTION_NAME,
  usersSchema,
);
