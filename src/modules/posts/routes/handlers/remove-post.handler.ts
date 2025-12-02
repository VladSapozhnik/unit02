import { Response } from 'express';
import { RequestWithParam } from '../../../../core/types/request.type';
import { IdPostParamDto } from '../../dto/id-post-param.dto';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { postsService } from '../../application/posts.service';

export const removePostHandler = async (
  req: RequestWithParam<IdPostParamDto>,
  res: Response,
) => {
  await postsService.removePost(req.params.id);

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
