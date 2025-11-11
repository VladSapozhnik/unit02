import { commentsService } from '../../../comments/application/comments.service';
import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { ObjectId, WithId } from 'mongodb';
import { PostType } from '../../types/post.type';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { commentsQueryRepository } from '../../../comments/repositories/comments.query.repository';
import { CommentType } from '../../../comments/types/comment.type';
import { usersRepository } from '../../../users/repositories/users.repository';
import { UserType } from '../../../users/type/user.type';

export const createCommentForPostHandler = async (
  req: Request,
  res: Response,
) => {
  if (!req.userId) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const findUser: WithId<UserType> | null = await usersRepository.getUserById(
    req.userId,
  );

  if (!findUser) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const existPost: WithId<PostType> | null = await postsRepository.findPostById(
    req.params.postId,
  );

  if (!existPost) {
    throw new NotFoundError('Not Found Post', 'post');
  }

  const id: ObjectId = await commentsService.createComment(
    findUser,
    existPost._id,
    req.body,
  );

  const findComment: CommentType | null =
    await commentsQueryRepository.getCommentById(id);

  res.status(HTTP_STATUS.CREATED_201).send(findComment);
};
