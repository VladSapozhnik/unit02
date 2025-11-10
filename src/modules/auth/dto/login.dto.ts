export type LoginDto = {
  loginOrEmail: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
};
