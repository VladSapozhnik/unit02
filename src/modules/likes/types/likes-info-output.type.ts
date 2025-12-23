import { LikeStatusEnum } from '../enums/like-status.enum';

export class LikesInfoOutputType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusEnum;
  constructor(
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusEnum,
  ) {
    this.likesCount = likesCount;
    this.dislikesCount = dislikesCount;
    this.myStatus = myStatus;
  }
}
