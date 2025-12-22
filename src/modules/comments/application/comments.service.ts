import { UserDbType } from '../../users/type/user.type';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Types } from 'mongoose';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { ForbiddenRequestError } from '../../../core/errors/forbidden-request.error';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { PostDBType } from '../../posts/types/post.type';
import { UnauthorizedError } from '../../../core/errors/unauthorized.error';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { injectable, inject } from 'inversify';
import { CommentsRepository } from '../repositories/comments.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { CommentDocument, CommentModel } from '../entities/comment.entity';

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async createComment(
    userId: string,
    postId: string,
    body: CreateCommentDto,
  ): Promise<string> {
    const existUser: UserDbType | null =
      await this.usersRepository.getUserById(userId);

    if (!existUser) {
      throw new UnauthorizedError('Unauthorized');
    }

    const existPost: PostDBType | null =
      await this.postsRepository.findPostById(postId);

    if (!existPost) {
      throw new NotFoundError('Not Found Post', 'post');
    }

    const newComment = new CommentModel({
      postId: new Types.ObjectId(postId),
      content: body.content,
      commentatorInfo: {
        userId: new Types.ObjectId(existUser._id),
        userLogin: existUser.login,
      },
    });

    // const payload: CommentDBType = new CommentDBType(
    //   new Types.ObjectId(),
    //   new Types.ObjectId(postId),
    //   body.content,
    //   {
    //     userId: new Types.ObjectId(existUser._id),
    //     userLogin: existUser.login,
    //   },
    //   new Date(),
    // );

    const commentId: string =
      await this.commentsRepository.createComment(newComment);

    if (!commentId) {
      throw new BadRequestError('Failed to create comment', 'comment');
    }

    return commentId;
  }

  async updateComment(userId: string, id: string, body: UpdateCommentDto) {
    const findComment: CommentDocument | null =
      await this.commentsRepository.getCommentById(id);

    if (!findComment) {
      throw new NotFoundError(`Comment with id ${id} not found`, 'comment');
    }

    if (findComment.commentatorInfo.userId.toString() !== userId) {
      throw new ForbiddenRequestError(
        'You can delete only your own comments',
        'comment',
      );
    }

    findComment.content = body.content;

    await this.commentsRepository.updateComment(findComment);
  }

  async removeComment(userId: string, id: string) {
    const findComment: CommentDocument | null =
      await this.commentsRepository.getCommentById(id);

    if (!findComment) {
      throw new NotFoundError(`Comment with id ${id} not found`, 'comment');
    }

    if (findComment.commentatorInfo.userId.toString() !== userId) {
      throw new ForbiddenRequestError(
        'You can delete only your own comments',
        'comment',
      );
    }

    await this.commentsRepository.removeComment(findComment);
  }
}
