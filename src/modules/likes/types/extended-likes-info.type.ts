import { LikeStatusEnum } from '../enums/like-status.enum';

export type NewestLikeViewType = {
  addedAt: string;
  userId: string;
  login: string;
};

export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusEnum;
  newestLikes: NewestLikeViewType[];
};
