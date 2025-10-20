import { Response } from 'express';
import { RequestWithParamAndBody } from '../../types/request.type';
import { QueryBlogDto } from '../../dto/blog/query-blog.dto';
import { UpdateBlogDto } from '../../dto/blog/update-blog.dto';
import { blogsRepository } from '../../repository/blogs.repository';
import { HTTP_STATUS } from '../../enums/http-status';

export const updateBlogController = async (
  req: RequestWithParamAndBody<QueryBlogDto, UpdateBlogDto>,
  res: Response,
) => {
  const isUpdated: boolean = await blogsRepository.updateBlog(
    req.params.id,
    req.body,
  );

  if (isUpdated) {
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    return;
  } else {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
  }
};
