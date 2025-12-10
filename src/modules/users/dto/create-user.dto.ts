// export type CreateUserDto = {
//   login: string;
//   password: string;
//   email: string;
// };
//
// export type CreateUserWithCreatedAtDto = CreateUserDto & {
//   createdAt: string;
// };

export class CreateUserDto {
  login: string;
  password: string;
  email: string;
  constructor(login: string, password: string, email: string) {
    this.login = login;
    this.password = password;
    this.email = email;
  }
}
