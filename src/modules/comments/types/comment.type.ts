import { Types } from 'mongoose';

// export type CommentType = {
//   /**
//    * type exist comment
//    */
//   id?: string | ObjectId;
//   postId?: string | ObjectId;
//   content: string;
//   commentatorInfo: { userId: string | ObjectId; userLogin: string };
//   createdAt: string;
// };

export class CommentDBType {
  /**
   * type exist comment
   */
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  content: string;
  commentatorInfo: { userId: Types.ObjectId; userLogin: string };
  createdAt: string;

  constructor(
    _id: Types.ObjectId,
    postId: Types.ObjectId,
    content: string,
    commentatorInfo: { userId: Types.ObjectId; userLogin: string },
    createdAt: string,
  ) {
    this._id = _id;
    this.postId = postId;
    this.content = content;
    this.commentatorInfo = commentatorInfo;
    this.createdAt = createdAt;
  }
}
