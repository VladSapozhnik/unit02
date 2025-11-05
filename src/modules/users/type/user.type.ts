export type UserType = {
  id?: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserDbType = {
  login: string;
  email: string;
  password: string;
  createdAt: string;
};
