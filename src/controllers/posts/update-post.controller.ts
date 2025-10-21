import { Response } from 'express';
import { RequestWithParamAndBody } from '../../types/request.type';
import { QueryPostDto } from '../../dto/post/query-post.dto';
import { UpdatePostDto } from '../../dto/post/update-post.dto';
import { postsRepository } from '../../repository/posts.repository';
import { HTTP_STATUS } from '../../enums/http-status';

export const updatePostController = async (
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
    res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
  }
};
