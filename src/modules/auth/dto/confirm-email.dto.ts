// export type ConfirmEmailDto = {
//   code: string;
// };

export class ConfirmEmailDto {
  code: string;

  constructor(code: string) {
    this.code = code;
  }
}
