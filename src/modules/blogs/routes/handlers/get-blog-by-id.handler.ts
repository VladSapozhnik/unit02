import { RequestWithParam } from '../../../../core/types/request.type';
import { QueryBlogDto } from '../../dto/query-blog.dto';
import { Response } from 'express';
import { BlogType } from '../../types/blog.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { WithId } from 'mongodb';
import { blogMapper } from '../mappers/blog.mapper';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const getBlogByIdHandler = async (
  req: RequestWithParam<QueryBlogDto>,
  res: Response,
) => {
  try {
    const existBlog: WithId<BlogType> | null = await blogsService.getBlogById(
      req.params.id,
    );

    if (!existBlog) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }

    res.json(blogMapper(existBlog));
  } catch (e) {
    errorsHandler(e, res);
  }
};
