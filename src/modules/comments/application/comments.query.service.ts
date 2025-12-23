import { inject, injectable } from 'inversify';
import { CommentsQueryRepository } from '../repositories/comments.query.repository';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { commentMapper } from '../mappers/comment.mapper';
import { CommentQueryInput } from '../routes/input/comment-query.input';
import { CommentOutputType } from '../types/comment-output.type';
import { CommentAndLikesMapper } from '../mappers/comment-and-likes.mapper';
import { CommentDocument } from '../entities/comment.entity';
import { LikesQueryService } from '../../likes/application/likes.query.service';
import { LikesInfoOutputType } from '../../likes/types/likes-info-output.type';

@injectable()
export class CommentsQueryService {
  constructor(
    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
    @inject(LikesQueryService)
    private likesQueryService: LikesQueryService,
  ) {}

  async getCommentById(
    id: string,
    userId: string | undefined,
  ): Promise<CommentOutputType> {
    const comment: CommentDocument | null =
      await this.commentsQueryRepository.getCommentById(id);

    if (!comment) {
      throw new NotFoundError(`Comment with id ${id} not found`, 'comment');
    }

    // const { likesCount, dislikesCount } =
    //   await this.likesQueryRepository.getLikesAndDislikesComment(
    //     comment._id.toString(),
    //   );
    //
    // let myStatus: LikeStatusEnum = LikeStatusEnum.None;
    //
    // if (userId) {
    //   const myLike = await this.likesQueryRepository.findLike(
    //     userId,
    //     comment._id.toString(),
    //   );
    //   myStatus = myLike ? myLike.status : LikeStatusEnum.None;
    // }
    //
    // const likesInfo: LikesInfoOutputType = new LikesInfoOutputType(
    //   likesCount,
    //   dislikesCount,
    //   myStatus,
    // );

    const likesInfo: LikesInfoOutputType =
      await this.likesQueryService.likesInfoForComment(
        comment._id.toString(),
        userId,
      );

    return commentMapper(comment, likesInfo);
  }

  async getCommentsByPostId(
    queryDto: CommentQueryInput,
    postId: string,
    userId: string,
  ) {
    const { comments, pagination } =
      await this.commentsQueryRepository.getCommentsByPostId(queryDto, postId);

    const commentsOutput: CommentOutputType[] = await Promise.all(
      comments.map(
        async (comment: CommentDocument): Promise<CommentOutputType> => {
          const likesInfo: LikesInfoOutputType =
            await this.likesQueryService.likesInfoForComment(
              comment._id.toString(),
              userId,
            );

          return commentMapper(comment, likesInfo);
        },
      ),
    );

    return CommentAndLikesMapper<CommentOutputType>(pagination, commentsOutput);
  }
}
