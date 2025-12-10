// export type LoginDto = {
//   loginOrEmail: string;
//   password: string;
// };

export class LoginDto {
  loginOrEmail: string;
  password: string;

  constructor(loginOrEmail: string, password: string) {
    this.loginOrEmail = loginOrEmail;
    this.password = password;
  }
}
