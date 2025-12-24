import { LikeStatusEnum } from '../enums/like-status.enum';
import { LikesDocument } from '../entities/likes.entity';
import {
  ExtendedLikesInfoType,
  NewestLikeViewType,
} from '../types/extended-likes-info.type';

export const LikeInfoForPostMapper = (
  like: number,
  dislike: number,
  myStatus: LikeStatusEnum,
  newestLikes: LikesDocument[],
): ExtendedLikesInfoType => {
  return {
    likesCount: like,
    dislikesCount: dislike,
    myStatus,
    newestLikes: newestLikes.map(
      (like: LikesDocument): NewestLikeViewType => ({
        addedAt: like.createdAt.toISOString(),
        userId: like.userId.toString(),
        login: like.login,
      }),
    ),
  };
};
