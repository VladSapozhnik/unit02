import { inject, injectable } from 'inversify';
import { LikesRepository } from '../repositories/likes.repository';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { CommentsRepository } from '../../comments/repositories/comments.repository';
import { CommentDBType } from '../../comments/types/comment.type';
import { Result } from '../../../core/types/result.type';
import { ResultStatus } from '../../../core/enums/result-status.enum';

@injectable()
export class LikesService {
  constructor(
    @inject(LikesRepository) private readonly likesRepository: LikesRepository,
    @inject(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async updateCommentLikeStatus(
    userId: string,
    commentId: string,
    likeStatus: LikeStatusEnum,
  ): Promise<Result> {
    const isComments: CommentDBType | null =
      await this.commentsRepository.getCommentById(commentId);

    if (!isComments) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Comment not found',
        extensions: [{ field: 'commentId', message: 'CommentId not found.' }],
        data: null,
      };
    }

    await this.likesRepository.updateCommentLikeStatus(
      userId,
      commentId,
      likeStatus,
    );

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }
}
