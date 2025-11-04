import { Response } from 'express';
import { RequestWithParam } from '../../../../core/types/request.type';
import { idPostParamDto } from '../../dto/id-post-param.dto';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const removePostHandler = async (
  req: RequestWithParam<idPostParamDto>,
  res: Response,
) => {
  try {
    const isRemove: boolean = await postsService.removePost(req.params.id);

    if (!isRemove) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  } catch (e) {
    errorsHandler(e, res);
  }
};
