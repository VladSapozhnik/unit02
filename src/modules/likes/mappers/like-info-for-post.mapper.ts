import { LikeStatusEnum } from '../enums/like-status.enum';
import { LikesDocument } from '../entities/likes.entity';

export const LikeInfoForPostMapper = (
  like: number,
  dislike: number,
  myStatus: LikeStatusEnum,
  newestLikes: LikesDocument[],
) => {
  return {
    extendedLikesInfo: {
      likesCount: like,
      dislikesCount: dislike,
      myStatus,
      newestLikes: newestLikes.map((like: LikesDocument) => [
        {
          addedAt: like.createdAt.toISOString(),
          userId: like.userId,
          login: like.login,
        },
      ]),
    },
  };
};
