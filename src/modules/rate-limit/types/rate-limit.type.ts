import { Types } from 'mongoose';

export class RateLimitDBType {
  _id: Types.ObjectId;
  ip: string;
  url: string;
  date: Date;

  constructor(_id: Types.ObjectId, ip: string, url: string, date: Date) {
    this._id = _id;
    this.ip = ip;
    this.url = url;
    this.date = date;
  }
}
