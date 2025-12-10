import { ObjectId } from 'mongodb';

export type CommentType = {
  /**
   * type exist comment
   */
  id?: string | ObjectId;
  postId?: string | ObjectId;
  content: string;
  commentatorInfo: { userId: string | ObjectId; userLogin: string };
  createdAt: string;
};
