import { injectable } from 'inversify';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { Types, UpdateResult } from 'mongoose';
import { LikesAndDislikesType } from '../types/likes-and-dislikes.type';
import { LikeModel, LikesDocument } from '../entities/likes.entity';
import { LikeTargetEnum } from '../enums/like-target.enum';

@injectable()
export class LikesRepository {
  async updateLikeStatus(
    userId: string,
    targetId: string,
    targetType: LikeTargetEnum,
    likeStatus: LikeStatusEnum,
  ): Promise<boolean> {
    const result: UpdateResult = await LikeModel.updateOne(
      {
        userId: new Types.ObjectId(userId),
        targetId: new Types.ObjectId(targetId),
        targetType,
      },
      {
        status: likeStatus,
      },
      { upsert: true },
    );

    return result.modifiedCount === 1;
  }
}
