import { LikeStatusEnum } from '../enums/like-status.enum';

export class LikeStatusDto {
  likeStatus: LikeStatusEnum;
  constructor(likeStatus: LikeStatusEnum) {
    this.likeStatus = likeStatus;
  }
}
