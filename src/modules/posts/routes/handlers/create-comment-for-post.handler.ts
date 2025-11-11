import { commentsService } from '../../../comments/application/comments.service';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { commentsQueryRepository } from '../../../comments/repositories/comments.query.repository';
import { CommentType } from '../../../comments/types/comment.type';

export const createCommentForPostHandler = async (
  req: Request,
  res: Response,
) => {
  const userId: string = req.userId as string;
  const postId: string = req.params.postId;

  const id: string = await commentsService.createComment(
    userId,
    postId,
    req.body,
  );

  const findComment: CommentType | null =
    await commentsQueryRepository.getCommentById(id);

  res.status(HTTP_STATUS.CREATED_201).send(findComment);
};
