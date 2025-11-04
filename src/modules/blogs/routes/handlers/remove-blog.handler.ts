import { Response } from 'express';
import { RequestWithParam } from '../../../../core/types/request.type';
import { idBlogParamDto } from '../../dto/id-blog-param.dto';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const removeBlogHandler = async (
  req: RequestWithParam<idBlogParamDto>,
  res: Response,
) => {
  try {
    await blogsService.removeBlogById(req.params.id);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  } catch (e) {
    errorsHandler(e, res);
  }
};
