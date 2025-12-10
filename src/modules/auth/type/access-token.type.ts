// export type AccessTokenType = {
//   /**
//    * Represents a JWT access token returned to the client
//    */
//   accessToken: string;
// };

export class AccessTokenType {
  /**
   * Represents a JWT access token returned to the client
   */
  accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
