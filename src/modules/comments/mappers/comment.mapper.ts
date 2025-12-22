import {
  LikesInfoOutputType,
  CommentOutputType,
} from '../types/comment-output.type';
import { CommentDocument } from '../entities/comment.entity';

export const commentMapper = (
  comment: CommentDocument,
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
