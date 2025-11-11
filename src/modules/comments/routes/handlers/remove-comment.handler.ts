import { Response } from 'express';
import { commentsService } from '../../application/comments.service';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';
import { WithId } from 'mongodb';
import { UserType } from '../../../users/type/user.type';
import { usersRepository } from '../../../users/repositories/users.repository';
import { RequestUserIdParam } from '../../../../core/types/request-userId.type';
import { CommentIdType } from '../../types/commentId.type';

export const removeCommentHandler = async (
  req: RequestUserIdParam<CommentIdType>,
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

  const isRemove: boolean = await commentsService.removeComment(
    findUser,
    req.params.commentId,
  );

  if (!isRemove) {
    throw new NotFoundError(`Comment with id not found`, 'comments');
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
