import { LikeStatusEnum } from '../enums/like-status.enum';
import { Types } from 'mongoose';

export class LikesDbType {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  commentId: Types.ObjectId;
  status: LikeStatusEnum;
  createdAt: Date;

  constructor(
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    commentId: Types.ObjectId,
    status: LikeStatusEnum,
    createdAt: Date,
  ) {
    this._id = _id;
    this.userId = userId;
    this.commentId = commentId;
    this.status = status;
    this.createdAt = createdAt;
  }
}
