// export type RefreshTokenOnlyType = {
//   currentRefreshToken: string;
// };

export class RefreshTokenOnlyType {
  currentRefreshToken: string;

  constructor(currentRefreshToken: string) {
    this.currentRefreshToken = currentRefreshToken;
  }
}
