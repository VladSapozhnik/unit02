import { Response } from 'express';
import { RequestWithParamAndBody } from '../../../../core/types/request.type';
import { QueryPostDto } from '../../dto/query-post.dto';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { postsRepository } from '../../repositories/posts.repository';
import { HTTP_STATUS } from '../../../../core/enums/http-status';

export const updatePostHandler = async (
  req: RequestWithParamAndBody<QueryPostDto, UpdatePostDto>,
  res: Response,
) => {
  try {
    const isUpdatedPost: boolean = await postsRepository.updatePost(
      req.params.id,
      req.body,
    );

    if (!isUpdatedPost) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  } catch {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
