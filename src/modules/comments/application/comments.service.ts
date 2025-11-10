import { UserType } from '../../users/type/user.type';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { commentsRepository } from '../repositories/comments.repository';
import { CommentType } from '../types/comment.type';

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
  async getCommentById() {},
  async updateComment() {},
  async removeComment() {},
};
