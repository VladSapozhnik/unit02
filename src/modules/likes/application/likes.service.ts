import { inject, injectable } from 'inversify';
import { LikesRepository } from '../repositories/likes.repository';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { CommentsRepository } from '../../comments/repositories/comments.repository';
import { Result } from '../../../core/types/result.type';
import { ResultStatus } from '../../../core/enums/result-status.enum';
import { CommentDocument } from '../../comments/entities/comment.entity';
import { LikeTargetEnum } from '../enums/like-target.enum';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { PostsDocument } from '../../posts/entities/post.entity';

@injectable()
export class LikesService {
  constructor(
    @inject(LikesRepository) private readonly likesRepository: LikesRepository,
    @inject(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
  ) {}

  async updateCommentLikeStatus(
    userId: string,
    targetId: string,
    likeStatus: LikeStatusEnum,
  ): Promise<Result> {
    const isComments: CommentDocument | null =
      await this.commentsRepository.getCommentById(targetId);

    if (!isComments) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Comment not found',
        extensions: [{ field: 'commentId', message: 'CommentId not found.' }],
        data: null,
      };
    }

    await this.likesRepository.updateLikeStatus(
      userId,
      targetId,
      LikeTargetEnum.Comment,
      likeStatus,
    );

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  async updatePostLikeStatus(
    userId: string,
    postId: string,
    likeStatus: LikeStatusEnum,
  ): Promise<Result> {
    const isPosts: PostsDocument | null =
      await this.postsRepository.findPostById(postId);

    if (!isPosts) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Comment not found',
        extensions: [{ field: 'commentId', message: 'CommentId not found.' }],
        data: null,
      };
    }

    await this.likesRepository.updateLikeStatus(
      userId,
      postId,
      LikeTargetEnum.Post,
      likeStatus,
    );

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }
}
