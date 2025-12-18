import { Types } from 'mongoose';

export class BlogDBType {
  /**
   * response successfully dto
   */
  _id: Types.ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;

  constructor(
    _id: Types.ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean,
  ) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = createdAt;

    this.isMembership = isMembership;
  }
}
