import { Request, Response } from 'express';
import { commentsQueryRepository } from '../../repositories/comments.query.repository';
import { CommentType } from '../../types/comment.type';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';
import { RequestWithParam } from '../../../../core/types/request.type';
import { IdCommentType } from '../../types/id-comment.type';

export const getCommentsById = async (
  req: RequestWithParam<IdCommentType>,
  res: Response<CommentType>,
) => {
  const comment: CommentType | null =
    await commentsQueryRepository.getCommentById(req.params.id);

  if (!comment) {
    throw new NotFoundError(
      `Comment with id ${req.params.id} not found`,
      'comment',
    );
  }

  res.json(comment);
};
