import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { commentsService } from '../../application/comments.service';
import { BadRequestError } from '../../../../core/errors/bad-request.error';

export const updateCommentHandler = async (req: Request, res: Response) => {
  const isUpdated: boolean = await commentsService.updateComment(
    req.user,
    req.params.commentId,
    req.body,
  );

  if (!isUpdated) {
    throw new BadRequestError(`Comment with id not found`, 'comment');
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
