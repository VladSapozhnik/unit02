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
import { UsersRepository } from '../../users/repositories/users.repository';
import { UsersDocument } from '../../users/entities/user.entity';

@injectable()
export class LikesService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
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
    const findUser: UsersDocument | null =
      await this.usersRepository.getUserById(userId);

    if (!findUser) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Comment not found',
        extensions: [{ field: 'auth', message: 'User not found.' }],
        data: null,
      };
    }

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
      findUser,
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
    const findUser: UsersDocument | null =
      await this.usersRepository.getUserById(userId);

    if (!findUser) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Comment not found',
        extensions: [{ field: 'auth', message: 'User not found.' }],
        data: null,
      };
    }

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
      findUser,
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
