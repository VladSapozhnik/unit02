import { Request, Response } from 'express';
import { commentsService } from '../../application/comments.service';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';

export const removeCommentHandler = async (req: Request, res: Response) => {
  const isRemove: boolean = await commentsService.removeComment(
    req.user,
    req.params.commentId,
  );

  if (!isRemove) {
    throw new NotFoundError(`Comment with id not found`, 'comments');
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
