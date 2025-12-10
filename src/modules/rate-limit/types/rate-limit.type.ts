// export type RateLimitType = {
//   ip: string;
//   url: string;
//   date: Date;
// };

export class RateLimitDBType {
  ip: string;
  url: string;
  date: Date;

  constructor(ip: string, url: string, date: Date) {
    this.ip = ip;
    this.url = url;
    this.date = date;
  }
}
