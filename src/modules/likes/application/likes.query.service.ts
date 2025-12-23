import { LikeTargetEnum } from '../enums/like-target.enum';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { LikesDocument } from '../entities/likes.entity';
import { inject, injectable } from 'inversify';
import { LikesQueryRepository } from '../repositories/likes.query.repository';
import { LikesInfoOutputType } from '../types/likes-info-output.type';
import { LikeInfoForPostMapper } from '../mappers/like-info-for-post.mapper';

@injectable()
export class LikesQueryService {
  constructor(
    @inject(LikesQueryRepository)
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}
  async likesInfoForComment(
    commentId: string,
    userId: string | undefined,
  ): Promise<LikesInfoOutputType> {
    const { likesCount, dislikesCount } =
      await this.likesQueryRepository.getLikesAndDislikesComment(
        commentId,
        LikeTargetEnum.Comment,
      );

    let myStatus: LikeStatusEnum = LikeStatusEnum.None;

    if (userId) {
      const myLike: LikesDocument | null =
        await this.likesQueryRepository.findLike(
          userId,
          commentId,
          LikeTargetEnum.Comment,
        );
      myStatus = myLike ? myLike.status : LikeStatusEnum.None;
    }

    return new LikesInfoOutputType(likesCount, dislikesCount, myStatus);
  }

  async likesInfoForPosts(postsId: string, userId: string | undefined) {
    const { likesCount, dislikesCount } =
      await this.likesQueryRepository.getLikesAndDislikesComment(
        postsId,
        LikeTargetEnum.Post,
      );

    let myStatus: LikeStatusEnum = LikeStatusEnum.None;

    if (userId) {
      const myLike: LikesDocument | null =
        await this.likesQueryRepository.findLike(
          userId,
          postsId,
          LikeTargetEnum.Comment,
        );
      myStatus = myLike ? myLike.status : LikeStatusEnum.None;
    }

    const newestLikes: LikesDocument[] =
      await this.likesQueryRepository.findNewestLikes(
        postsId,
        LikeTargetEnum.Post,
      );

    return LikeInfoForPostMapper(
      likesCount,
      dislikesCount,
      myStatus,
      newestLikes,
    );
  }
}
