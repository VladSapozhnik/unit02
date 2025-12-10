// export type ResendEmailDto = {
//   email: string;
// };

export class ResendEmailDto {
  email: string;
  constructor(email: string) {
    this.email = email;
  }
}
