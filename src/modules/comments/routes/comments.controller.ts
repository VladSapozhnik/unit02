import { RequestWithParam } from '../../../core/types/request.type';
import { IdCommentType } from '../types/id-comment.type';
import { Response } from 'express';
import { CommentDBType } from '../types/comment.type';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import {
  RequestUserIdParam,
  RequestUserIdWithParamAndBody,
} from '../../../core/types/request-userId.type';
import { CommentIdType } from '../types/commentId.type';
import { HTTP_STATUS } from '../../../core/enums/http-status.enum';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { injectable, inject } from 'inversify';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../repositories/comments.query.repository';
import { CommentOutputType } from '../types/comment-output.type';

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService) private readonly commentsService: CommentsService,
    @inject(CommentsQueryRepository)
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async getCommentsById(
    req: RequestWithParam<IdCommentType>,
    res: Response<CommentOutputType>,
  ) {
    const comment: CommentOutputType | null =
      await this.commentsQueryRepository.getCommentById(req.params.id);

    if (!comment) {
      throw new NotFoundError(
        `Comment with id ${req.params.id} not found`,
        'comment',
      );
    }

    res.json(comment);
  }

  async updateComment(
    req: RequestUserIdWithParamAndBody<CommentIdType, UpdateCommentDto>,
    res: Response,
  ) {
    const userId: string = req.userId as string;

    await this.commentsService.updateComment(
      userId,
      req.params.commentId,
      req.body,
    );

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  async removeComment(req: RequestUserIdParam<CommentIdType>, res: Response) {
    const userId: string = req.userId as string;

    await this.commentsService.removeComment(userId, req.params.commentId);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
}
