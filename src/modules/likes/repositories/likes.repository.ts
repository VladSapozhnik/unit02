import { injectable } from 'inversify';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { Types, UpdateResult } from 'mongoose';
import { LikeModel } from '../entities/likes.entity';
import { LikeTargetEnum } from '../enums/like-target.enum';
import { UsersDocument } from '../../users/entities/user.entity';

@injectable()
export class LikesRepository {
  async updateLikeStatus(
    user: UsersDocument,
    targetId: string,
    targetType: LikeTargetEnum,
    likeStatus: LikeStatusEnum,
  ): Promise<boolean> {
    const result: UpdateResult = await LikeModel.updateOne(
      {
        userId: new Types.ObjectId(user._id),
        login: user.login,
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
