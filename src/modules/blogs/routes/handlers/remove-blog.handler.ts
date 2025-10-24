import { Response } from 'express';
import { RequestWithParam } from '../../../../core/types/request.type';
import { QueryBlogDto } from '../../dto/query-blog.dto';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HTTP_STATUS } from '../../../../core/enums/http-status';

export const removeBlogHandler = async (
  req: RequestWithParam<QueryBlogDto>,
  res: Response,
) => {
  try {
    const isDelete: boolean = await blogsRepository.removeBlogById(
      req.params.id,
    );

    if (!isDelete) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
