import { LikeModel, LikesDocument } from '../entities/likes.entity';
import { LikeTargetEnum } from '../enums/like-target.enum';
import { LikesAndDislikesType } from '../types/likes-and-dislikes.type';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { injectable } from 'inversify';
import { Types } from 'mongoose';

@injectable()
export class LikesQueryRepository {
  async getLikesAndDislikesComment(
    targetId: string,
    targetType: LikeTargetEnum,
  ): Promise<LikesAndDislikesType> {
    const [likesCount, dislikesCount] = await Promise.all([
      LikeModel.countDocuments({
        targetId,
        targetType,
        status: LikeStatusEnum.Like,
      }),
      LikeModel.countDocuments({
        targetId,
        targetType,
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
    targetId: string,
    targetType: LikeTargetEnum,
  ): Promise<LikesDocument | null> {
    return LikeModel.findOne({
      userId: new Types.ObjectId(userId),
      targetId: new Types.ObjectId(targetId),
      targetType,
    });
  }
}
