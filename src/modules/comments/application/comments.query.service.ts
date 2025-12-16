import { inject, injectable } from 'inversify';
import { CommentsQueryRepository } from '../repositories/comments.query.repository';
import { CommentDBType } from '../types/comment.type';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { commentMapper } from '../mappers/comment.mapper';
import { CommentQueryInput } from '../routes/input/comment-query.input';
import {
  CommentOutputType,
  LikesInfoOutputType,
} from '../types/comment-output.type';
import { LikesRepository } from '../../likes/repositories/likes.repository';
import { LikeStatusEnum } from '../../likes/enums/like-status.enum';
import { CommentAndLikesMapper } from '../mappers/comment-and-likes.mapper';

@injectable()
export class CommentsQueryService {
  constructor(
    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
    @inject(LikesRepository) private likesRepository: LikesRepository,
  ) {}

  async getCommentById(
    id: string,
    userId: string | null,
  ): Promise<CommentOutputType> {
    const comment: CommentDBType | null =
      await this.commentsQueryRepository.getCommentById(id);

    if (!comment) {
      throw new NotFoundError(`Comment with id ${id} not found`, 'comment');
    }

    const [likesCount, dislikeCount] = await Promise.all([
      this.likesRepository.countLikesComment(comment._id.toString()),
      this.likesRepository.countDislikeComment(comment._id.toString()),
    ]);

    let myStatus: LikeStatusEnum = LikeStatusEnum.None;

    if (userId) {
      const myLike = await this.likesRepository.findLike(
        userId,
        comment._id.toString(),
      );

      myStatus = myLike ? myLike.status : LikeStatusEnum.None;
    }

    const likesInfo: LikesInfoOutputType = new LikesInfoOutputType(
      likesCount,
      dislikeCount,
      myStatus,
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
      comments.map(async (comment: CommentDBType) => {
        const [likeCount, dislikeCount] = await Promise.all([
          this.likesRepository.countLikesComment(comment._id.toString()),
          this.likesRepository.countDislikeComment(comment._id.toString()),
        ]);

        let myStatus: LikeStatusEnum = LikeStatusEnum.None;

        if (userId) {
          const myLike = await this.likesRepository.findLike(
            userId,
            comment._id.toString(),
          );

          myStatus = myLike ? myLike.status : LikeStatusEnum.None;
        }

        const likesInfo: LikesInfoOutputType = new LikesInfoOutputType(
          likeCount,
          dislikeCount,
          myStatus,
        );

        return commentMapper(comment, likesInfo);
      }),
    );

    return CommentAndLikesMapper<CommentOutputType>(pagination, commentsOutput);
  }
}
