import { Response } from 'express';
import { RequestWithParam } from '../../../../core/types/request.type';
import { idPostParamDto } from '../../dto/id-post-param.dto';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { postsService } from '../../application/posts.service';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';

export const removePostHandler = async (
  req: RequestWithParam<idPostParamDto>,
  res: Response,
) => {
  const isRemove: boolean = await postsService.removePost(req.params.id);

  if (!isRemove) {
    throw new NotFoundError('Failed to remove Post', 'post');
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
