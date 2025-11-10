import { commentsService } from '../../../comments/application/comments.service';
import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { ObjectId, WithId } from 'mongodb';
import { PostType } from '../../types/post.type';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';

export const createCommentForPostHandler = async (
  req: Request,
  res: Response,
) => {
  const existPost: WithId<PostType> | null = await postsRepository.findPostById(
    req.params.postId,
  );

  if (!existPost) {
    throw new NotFoundError('Not Found Post', 'postId');
  }

  const id: ObjectId = await commentsService.createComment(
    req.user,
    existPost._id,
    req.body,
  );

  res.status(HTTP_STATUS.CREATED_201).send({
    lol: 'lol',
    id: id,
  });
};
