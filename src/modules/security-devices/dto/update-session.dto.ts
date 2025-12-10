// export type UpdateSessionDTO = {
//   ip: string;
//   title: string;
//   lastActiveDate: Date;
//   expiresAt: Date;
// };

export class UpdateSessionDTO {
  ip: string;
  title: string;
  lastActiveDate: Date;
  expiresAt: Date;
  constructor(
    ip: string,
    title: string,
    lastActiveDate: Date,
    expiresAt: Date,
  ) {
    this.ip = ip;
    this.title = title;
    this.lastActiveDate = lastActiveDate;
    this.expiresAt = expiresAt;
  }
}
