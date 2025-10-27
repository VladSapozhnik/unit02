import { Response } from 'express';
import { RequestWithParamAndBody } from '../../../../core/types/request.type';
import { QueryBlogDto } from '../../dto/query-blog.dto';
import { UpdateBlogDto } from '../../dto/update-blog.dto';
import { HTTP_STATUS } from '../../../../core/enums/http-status';
import { blogsService } from '../../application/blogs.service';

export const updateBlogHandler = async (
  req: RequestWithParamAndBody<QueryBlogDto, UpdateBlogDto>,
  res: Response,
) => {
  try {
    const isUpdated: boolean = await blogsService.updateBlog(
      req.params.id,
      req.body,
    );

    if (!isUpdated) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
