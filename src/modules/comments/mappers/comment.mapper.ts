import { WithId } from 'mongodb';
import { CommentDBType } from '../types/comment.type';
import { CommentOutputType } from '../types/comment-output.type';

export const commentMapper = (
  comment: WithId<CommentDBType>,
): CommentOutputType => {
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
