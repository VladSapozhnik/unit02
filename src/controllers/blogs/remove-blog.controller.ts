import { Response } from 'express';
import { RequestWithParam } from '../../types/request.type';
import { QueryBlogDto } from '../../dto/blog/query-blog.dto';
import { blogsRepository } from '../../repository/blogs.repository';
import { HTTP_STATUS } from '../../enums/http-status';

export const removeBlogController = async (
  req: RequestWithParam<QueryBlogDto>,
  res: Response,
) => {
  const isDelete: boolean = await blogsRepository.removeBlogById(req.params.id);

  if (!isDelete) {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    return;
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
