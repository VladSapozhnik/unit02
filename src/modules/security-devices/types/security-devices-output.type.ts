export class SecurityDevicesOutputType {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
  constructor(
    ip: string,
    title: string,
    lastActiveDate: Date,
    deviceId: string,
  ) {
    this.ip = ip;
    this.title = title;
    this.lastActiveDate = lastActiveDate;
    this.deviceId = deviceId;
  }
}
