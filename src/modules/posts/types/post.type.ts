import { Types } from 'mongoose';

export class PostDBType {
  /**
   * response successfully created dto
   */
  _id: Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: Types.ObjectId;
  blogName: string;
  createdAt: Date;

  constructor(
    _id: Types.ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: Types.ObjectId,
    blogName: string,
    createdAt: Date,
  ) {
    this._id = _id;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
    this.createdAt = createdAt;
  }
}
