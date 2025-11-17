import { UserType } from '../../users/type/user.type';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { ObjectId, WithId } from 'mongodb';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { commentsRepository } from '../repositories/comments.repository';
import { CommentType } from '../types/comment.type';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { ForbiddenRequestError } from '../../../core/errors/forbidden-request.error';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { PostType } from '../../posts/types/post.type';
import { postsRepository } from '../../posts/repositories/posts.repository';
import { usersRepository } from '../../users/repositories/users.repository';
import { UnauthorizedError } from '../../../core/errors/unauthorized.error';
import { BadRequestError } from '../../../core/errors/bad-request.error';

export const commentsService = {
  async createComment(
    userId: string,
    postId: string,
    body: CreateCommentDto,
  ): Promise<string> {
    const existUser: WithId<UserType> | null =
      await usersRepository.getUserById(userId);

    if (!existUser) {
      throw new UnauthorizedError('Unauthorized');
    }

    const existPost: WithId<PostType> | null =
      await postsRepository.findPostById(postId);

    if (!existPost) {
      throw new NotFoundError('Not Found Post', 'post');
    }

    const payload: CommentType = {
      content: body.content,
      postId: new ObjectId(postId),
      commentatorInfo: {
        userId: new ObjectId(existUser._id),
        userLogin: existUser.login,
      },
      createdAt: createdAtHelper(),
    };

    const commentId: string = await commentsRepository.createComment(payload);

    if (!commentId) {
      throw new BadRequestError('Failed to create comment', 'comment');
    }

    return commentId;
  },
  async updateComment(
    userId: string,
    id: string,
    body: UpdateCommentDto,
  ): Promise<boolean> {
    const findComment: CommentType | null =
      await commentsRepository.getCommentById(id);

    if (!findComment) {
      throw new NotFoundError(`Comment with id ${id} not found`, 'comment');
    }

    if (findComment.commentatorInfo.userId.toString() !== userId) {
      throw new ForbiddenRequestError(
        'You can delete only your own comments',
        'comment',
      );
    }

    const isUpdated: boolean = await commentsRepository.updateComment(id, body);

    if (!isUpdated) {
      throw new BadRequestError(`Comment with id not found`, 'comment');
    }

    return isUpdated;
  },
  async removeComment(userId: string, id: string): Promise<boolean> {
    const findComment: CommentType | null =
      await commentsRepository.getCommentById(id);

    if (!findComment) {
      throw new NotFoundError(`Comment with id ${id} not found`, 'comment');
    }

    if (findComment.commentatorInfo.userId.toString() !== userId) {
      throw new ForbiddenRequestError(
        'You can delete only your own comments',
        'comment',
      );
    }

    const isRemove: boolean = await commentsRepository.removeComment(id);

    if (!isRemove) {
      throw new NotFoundError(`Comment with id not found`, 'comments');
    }

    return isRemove;
  },
};
