import { injectable } from 'inversify';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { Types, UpdateResult } from 'mongoose';
import { LikesAndDislikesType } from '../types/likes-and-dislikes.type';
import { LikeModel, LikesDocument } from '../entities/likes.entity';

@injectable()
export class LikesRepository {
  async updateCommentLikeStatus(
    userId: string,
    commentId: string,
    likeStatus: LikeStatusEnum,
  ): Promise<boolean> {
    const result: UpdateResult = await LikeModel.updateOne(
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

  async getLikesAndDislikesComment(
    commentId: string,
  ): Promise<LikesAndDislikesType> {
    const [likesCount, dislikesCount] = await Promise.all([
      LikeModel.countDocuments({
        commentId,
        status: LikeStatusEnum.Like,
      }),
      LikeModel.countDocuments({
        commentId,
        status: LikeStatusEnum.Dislike,
      }),
    ]);

    return {
      likesCount,
      dislikesCount,
    };
  }

  async findLike(
    userId: string,
    commentId: string,
  ): Promise<LikesDocument | null> {
    return LikeModel.findOne({
      userId: new Types.ObjectId(userId),
      commentId: new Types.ObjectId(commentId),
    });
  }
}
