import { RequestWithParam } from '../../types/request.type';
import { QueryBlogDto } from '../../dto/blog/query-blog.dto';
import { Response } from 'express';
import { BlogType } from '../../types/blog.type';
import { blogsRepository } from '../../repository/blogs.repository';
import { HTTP_STATUS } from '../../enums/http-status';

export const getBlogByIdController = async (
  req: RequestWithParam<QueryBlogDto>,
  res: Response,
) => {
  const existBlog: BlogType | undefined = await blogsRepository.getBlogById(
    req.params.id,
  );

  if (!existBlog) {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    return;
  } else {
    res.send(existBlog);
    return;
  }
};
