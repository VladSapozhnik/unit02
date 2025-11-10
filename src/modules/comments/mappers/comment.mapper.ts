import { WithId } from 'mongodb';
import { CommentDbType, CommentType } from '../types/comment.type';

export const commentMapper = (comment: WithId<CommentDbType>): CommentType => {
  return {
    id: String(comment._id),
    content: comment.content,
    postId: String(comment.postId),
    commentatorInfo: {
      userId: String(comment.commentatorInfo.userId),
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
  };
};
