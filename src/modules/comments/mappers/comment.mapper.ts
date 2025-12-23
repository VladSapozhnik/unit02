import { CommentOutputType } from '../types/comment-output.type';
import { CommentDocument } from '../entities/comment.entity';
import { LikesInfoOutputType } from '../../likes/types/likes-info-output.type';

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
