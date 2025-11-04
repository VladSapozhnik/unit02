import { Response } from 'express';
import { RequestWithParamAndBody } from '../../../../core/types/request.type';
import { idBlogParamDto } from '../../dto/id-blog-param.dto';
import { UpdateBlogDto } from '../../dto/update-blog.dto';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const updateBlogHandler = async (
  req: RequestWithParamAndBody<idBlogParamDto, UpdateBlogDto>,
  res: Response,
) => {
  try {
    await blogsService.updateBlog(req.params.id, req.body);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  } catch (e) {
    errorsHandler(e, res);
  }
};
