// export type ProfileType = {
//   /**
//    * profile response exist user
//    */
//   email: string;
//   login: string;
//   userId: string;
// };

export class ProfileType {
  /**
   * profile response exist user
   */
  email: string;
  login: string;
  userId: string;
  constructor(email: string, login: string, userId: string) {
    this.email = email;
    this.login = login;
    this.userId = userId;
  }
}
