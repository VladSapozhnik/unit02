import { ObjectId } from 'mongodb';

export type UserType = {
  id?: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserDbType = {
  _id?: ObjectId;
  login: string;
  email: string;
  password: string;
  createdAt: string;
};
