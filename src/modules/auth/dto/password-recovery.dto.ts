// export type PasswordRecoveryDto = {
//   email: string;
// };
export class PasswordRecoveryDto {
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
