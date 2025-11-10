import { ObjectId } from 'mongodb';

export type CommentType = {
  id?: string;
  postId?: ObjectId;
  content: string;
  commentatorInfo: {
    userId: ObjectId;
    userLogin: string;
  };
  createdAt: string;
};
