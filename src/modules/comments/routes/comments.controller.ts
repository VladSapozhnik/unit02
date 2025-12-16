import { RequestWithParam } from '../../../core/types/request.type';
import { IdCommentType } from '../types/id-comment.type';
import { Response, Request } from 'express';
import {
  RequestUserIdParam,
  RequestUserIdWithParamAndBody,
} from '../../../core/types/request-userId.type';
import { CommentIdType } from '../types/commentId.type';
import { HTTP_STATUS } from '../../../core/enums/http-status.enum';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { injectable, inject } from 'inversify';
import { CommentsService } from '../application/comments.service';
import { CommentOutputType } from '../types/comment-output.type';
import { LikeStatusEnum } from '../../likes/enums/like-status.enum';
import { LikesService } from '../../likes/application/likes.service';
import { ResultStatus } from '../../../core/enums/result-status.enum';
import { Result } from '../../../core/types/result.type';
import { CommentsQueryService } from '../application/comments.query.service';

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService) private readonly commentsService: CommentsService,
    @inject(CommentsQueryService)
    private readonly commentsQueryService: CommentsQueryService,
    @inject(LikesService) private readonly likesService: LikesService,
  ) {}

  async getCommentsById(
    req: RequestWithParam<IdCommentType>,
    res: Response<CommentOutputType>,
  ) {
    const userId: string | undefined = req.userId;

    const comment: CommentOutputType =
      await this.commentsQueryService.getCommentById(req.params.id, userId);

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

  async updateCommentLikeStatus(req: Request, res: Response) {
    const userId: string = req.userId as string;
    const commentId: string = req.params.commentId;
    const likeStatus = req.body.likeStatus as LikeStatusEnum;

    const result: Result = await this.likesService.updateCommentLikeStatus(
      userId,
      commentId,
      likeStatus,
    );

    if (result.status === ResultStatus.NotFound) {
      return res.status(HTTP_STATUS.NOT_FOUND_404).json(result.extensions);
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
}
