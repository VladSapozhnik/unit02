import { ObjectId } from 'mongodb';

export class RateLimitDBType {
  _id: ObjectId;
  ip: string;
  url: string;
  date: Date;

  constructor(_id: ObjectId, ip: string, url: string, date: Date) {
    this._id = _id;
    this.ip = ip;
    this.url = url;
    this.date = date;
  }
}
