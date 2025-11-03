export type CreateUserDto = {
  login: string;
  password: string;
  email: string;
};

export type CreateUserWithCreatedAtAndSaltDto = CreateUserDto & {
  createdAt: string;
  passwordSalt: string;
};
