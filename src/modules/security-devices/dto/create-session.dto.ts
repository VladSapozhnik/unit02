// export type CreateSessionDto = {
//   userId: string;
//   deviceId: string;
//   ip: string;
//   title: string;
//   lastActiveDate: Date;
//   expiresAt: Date;
// };

export class CreateSessionDto {
  userId: string;
  deviceId: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  expiresAt: Date;

  constructor(
    userId: string,
    deviceId: string,
    ip: string,
    title: string,
    lastActiveDate: Date,
    expiresAt: Date,
  ) {
    this.userId = userId;
    this.deviceId = deviceId;
    this.ip = ip;
    this.title = title;
    this.lastActiveDate = lastActiveDate;
    this.expiresAt = expiresAt;
  }
}
