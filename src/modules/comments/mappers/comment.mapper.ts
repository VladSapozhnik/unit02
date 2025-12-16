import { CommentDBType } from '../types/comment.type';
import {
  LikesInfoOutputType,
  CommentOutputType,
} from '../types/comment-output.type';

export const commentMapper = (
  comment: CommentDBType,
  likesInfo: LikesInfoOutputType,
): CommentOutputType => {
  return {
    id: String(comment._id),
    content: comment.content,
    commentatorInfo: {
      userId: String(comment.commentatorInfo.userId),
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt.toISOString(),
    likesInfo,
  };
};
