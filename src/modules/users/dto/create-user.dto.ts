export type CreateUserDto = {
  login: string;
  password: string;
  email: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
};

export type CreateUserWithCreatedAtDto = CreateUserDto & {
  createdAt: string;
};
