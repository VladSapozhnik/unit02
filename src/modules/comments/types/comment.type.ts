import { Types } from 'mongoose';

export class CommentDBType {
  /**
   * type exist comment
   */
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  content: string;
  commentatorInfo: { userId: Types.ObjectId; userLogin: string };
  createdAt: Date;

  constructor(
    _id: Types.ObjectId,
    postId: Types.ObjectId,
    content: string,
    commentatorInfo: { userId: Types.ObjectId; userLogin: string },
    createdAt: Date,
  ) {
    this._id = _id;
    this.postId = postId;
    this.content = content;
    this.commentatorInfo = commentatorInfo;
    this.createdAt = createdAt;
  }
}
