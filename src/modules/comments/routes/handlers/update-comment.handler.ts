import { Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { commentsService } from '../../application/comments.service';
import { BadRequestError } from '../../../../core/errors/bad-request.error';
import { WithId } from 'mongodb';
import { UserType } from '../../../users/type/user.type';
import { usersRepository } from '../../../users/repositories/users.repository';
import { RequestUserIdWithParamAndBody } from '../../../../core/types/request-userId.type';
import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { CommentIdType } from '../../types/commentId.type';

export const updateCommentHandler = async (
  req: RequestUserIdWithParamAndBody<CommentIdType, UpdateCommentDto>,
  res: Response,
) => {
  if (!req.userId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED_401);
  }

  const findUser: WithId<UserType> | null = await usersRepository.getUserById(
    req.userId,
  );

  if (!findUser) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const isUpdated: boolean = await commentsService.updateComment(
    findUser,
    req.params.commentId,
    req.body,
  );

  if (!isUpdated) {
    throw new BadRequestError(`Comment with id not found`, 'comment');
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
