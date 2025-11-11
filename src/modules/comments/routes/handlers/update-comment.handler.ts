import { Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { commentsService } from '../../application/comments.service';
import { BadRequestError } from '../../../../core/errors/bad-request.error';
import { RequestUserIdWithParamAndBody } from '../../../../core/types/request-userId.type';
import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { CommentIdType } from '../../types/commentId.type';

export const updateCommentHandler = async (
  req: RequestUserIdWithParamAndBody<CommentIdType, UpdateCommentDto>,
  res: Response,
) => {
  const userId: string = req.userId as string;

  const isUpdated: boolean = await commentsService.updateComment(
    userId,
    req.params.commentId,
    req.body,
  );

  if (!isUpdated) {
    throw new BadRequestError(`Comment with id not found`, 'comment');
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
