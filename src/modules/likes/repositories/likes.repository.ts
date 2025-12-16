import { injectable } from 'inversify';
import { LikesModel } from '../../../core/db/mango.db';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { DeleteResult, Types, UpdateResult } from 'mongoose';
import { LikesDbType } from '../types/likes.type';

@injectable()
export class LikesRepository {
  async updateCommentLikeStatus(
    userId: string,
    commentId: string,
    likeStatus: LikeStatusEnum,
  ): Promise<boolean> {
    const result: UpdateResult = await LikesModel.updateOne(
      {
        userId: new Types.ObjectId(userId),
        commentId: new Types.ObjectId(commentId),
      },
      {
        status: likeStatus,
      },
      { upsert: true },
    );

    return result.modifiedCount === 1;
  }

  async removeCommentLikeStatus(
    userId: string,
    commentId: string,
  ): Promise<boolean> {
    const result: DeleteResult = await LikesModel.deleteOne({
      userId,
      commentId,
    });

    return result.deletedCount === 1;
  }

  async findLike(
    userId: string,
    commentId: string,
  ): Promise<LikesDbType | null> {
    return LikesModel.findOne({
      userId: new Types.ObjectId(userId),
      commentId: new Types.ObjectId(commentId),
    }).lean();
  }

  async countLikesComment(commentId: string): Promise<number> {
    return LikesModel.countDocuments({
      commentId,
      status: LikeStatusEnum.Like,
    });
  }

  async countDislikeComment(commentId: string): Promise<number> {
    return LikesModel.countDocuments({
      commentId,
      status: LikeStatusEnum.Dislike,
    });
  }
}
