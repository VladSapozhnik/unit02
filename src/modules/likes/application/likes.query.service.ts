import { LikeTargetEnum } from '../enums/like-target.enum';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { LikesDocument } from '../entities/likes.entity';
import { LikesInfoOutputType } from '../../comments/types/comment-output.type';
import { inject, injectable } from 'inversify';
import { LikesQueryRepository } from '../repositories/likes.query.repository';
import { CommentDocument } from '../../comments/entities/comment.entity';
import { PostsDocument } from '../../posts/entities/post.entity';

@injectable()
export class LikesQueryService {
  constructor(
    @inject(LikesQueryRepository)
    private readonly likesQueryRepository: LikesQueryRepository,
  ) {}
  async likesInfoForComment(
    comment: CommentDocument,
    userId: string | undefined,
  ): Promise<LikesInfoOutputType> {
    const { likesCount, dislikesCount } =
      await this.likesQueryRepository.getLikesAndDislikesComment(
        comment._id.toString(),
        LikeTargetEnum.Comment,
      );

    let myStatus: LikeStatusEnum = LikeStatusEnum.None;

    if (userId) {
      const myLike: LikesDocument | null =
        await this.likesQueryRepository.findLike(
          userId,
          comment._id.toString(),
          LikeTargetEnum.Comment,
        );
      myStatus = myLike ? myLike.status : LikeStatusEnum.None;
    }

    return new LikesInfoOutputType(likesCount, dislikesCount, myStatus);
  }

  async likesInfoForPosts(posts: PostsDocument, userId: string | undefined) {}
}
