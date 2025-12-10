// export type AccessAndRefreshTokensType = {
//   /**
//    * Represents a JWT access token returned to the client
//    */
//   accessToken: string;
//   refreshToken: string;
// };

export class AccessAndRefreshTokensType {
  /**
   * Represents a JWT access token returned to the client
   */
  accessToken: string;
  refreshToken: string;
  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
