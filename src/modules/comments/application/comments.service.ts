import { UserType } from '../../users/type/user.type';
import { CreateCommentDto } from '../dto/create-comment.dto';
import {
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { commentsRepository } from '../repositories/comments.repository';
import { CommentType } from '../types/comment.type';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { ForbiddenRequestError } from '../../../core/errors/forbidden-request.error';
import { UpdateCommentDto } from '../dto/update-comment.dto';

export const commentsService = {
  async createComment(
    user: WithId<UserType>,
    postId: ObjectId,
    body: CreateCommentDto,
  ): Promise<ObjectId> {
    const payload: CommentType = {
      content: body.content,
      postId: postId,
      commentatorInfo: {
        userId: user._id,
        userLogin: user.login,
      },
      createdAt: createdAtHelper(),
    };

    const result: InsertOneResult<CommentType> =
      await commentsRepository.createComment(payload);

    return result.insertedId;
  },
  async updateComment(
    user: WithId<UserType>,
    id: string,
    body: UpdateCommentDto,
  ): Promise<boolean> {
    const findComment: CommentType | null =
      await commentsRepository.getCommentById(id);

    if (!findComment) {
      throw new NotFoundError(`Comment with id ${id} not found`, 'comment');
    }

    if (findComment.commentatorInfo.userId.toString() !== user._id.toString()) {
      throw new ForbiddenRequestError(
        'You can delete only your own comments',
        'comment',
      );
    }

    const result: UpdateResult<WithId<CommentType>> =
      await commentsRepository.updateComment(id, body);

    return result.matchedCount === 1;
  },
  async removeComment(user: WithId<UserType>, id: string): Promise<boolean> {
    const findComment: CommentType | null =
      await commentsRepository.getCommentById(id);

    if (!findComment) {
      throw new NotFoundError(`Comment with id ${id} not found`, 'comment');
    }

    if (findComment.commentatorInfo.userId.toString() !== user._id.toString()) {
      throw new ForbiddenRequestError(
        'You can delete only your own comments',
        'comment',
      );
    }

    const result: DeleteResult = await commentsRepository.removeComment(id);

    return result.deletedCount === 1;
  },
};
