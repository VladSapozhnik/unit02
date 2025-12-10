import { ObjectId } from 'mongodb';

// export type BlogDBType = {
//   /**
//    * response successfully dto
//    */
//   _id: ObjectId;
//   name: string;
//   description: string;
//   websiteUrl: string;
//   createdAt: string;
//   isMembership: boolean;
// };

export class BlogDBType {
  /**
   * response successfully dto
   */
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  constructor(
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
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
