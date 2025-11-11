import { Response } from 'express';
import { commentsService } from '../../application/comments.service';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';
import { RequestUserIdParam } from '../../../../core/types/request-userId.type';
import { CommentIdType } from '../../types/commentId.type';

export const removeCommentHandler = async (
  req: RequestUserIdParam<CommentIdType>,
  res: Response,
) => {
  const userId: string = req.userId as string;

  const isRemove: boolean = await commentsService.removeComment(
    userId,
    req.params.commentId,
  );

  if (!isRemove) {
    throw new NotFoundError(`Comment with id not found`, 'comments');
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
