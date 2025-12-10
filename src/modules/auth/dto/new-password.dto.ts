// export type NewPasswordDto = {
//   newPassword: string;
//   recoveryCode: string;
// };

export class NewPasswordDto {
  newPassword: string;
  recoveryCode: string;

  constructor(newPassword: string, recoveryCode: string) {
    this.newPassword = newPassword;
    this.recoveryCode = recoveryCode;
  }
}
