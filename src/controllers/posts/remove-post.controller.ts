import { Response } from 'express';
import { RequestWithParam } from '../../types/request.type';
import { QueryPostDto } from '../../dto/post/query-post.dto';
import { postsRepository } from '../../repository/posts.repository';
import { HTTP_STATUS } from '../../enums/http-status';

export const removePostController = async (
  req: RequestWithParam<QueryPostDto>,
  res: Response,
) => {
  try {
    const isRemove: boolean = await postsRepository.removePost(req.params.id);

    if (!isRemove) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
