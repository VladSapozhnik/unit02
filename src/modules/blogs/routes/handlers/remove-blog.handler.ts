import { Response } from 'express';
import { RequestWithParam } from '../../../../core/types/request.type';
import { idBlogParamDto } from '../../dto/id-blog-param.dto';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { blogsService } from '../../application/blogs.service';

export const removeBlogHandler = async (
  req: RequestWithParam<idBlogParamDto>,
  res: Response,
) => {
  await blogsService.removeBlogById(req.params.id);

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
