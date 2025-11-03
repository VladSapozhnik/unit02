export type CreateUserDto = {
  login: string;
  password: string;
  email: string;
};

export type CreateUserWithCreatedAtDto = CreateUserDto & {
  createdAt: string;
};
