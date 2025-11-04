import { RequestWithParam } from '../../../../core/types/request.type';
import { idBlogParamDto } from '../../dto/id-blog-param.dto';
import { Response } from 'express';
import { BlogType } from '../../types/blog.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { WithId } from 'mongodb';
import { blogMapper } from '../mappers/blog.mapper';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';

export const getBlogByIdHandler = async (
  req: RequestWithParam<idBlogParamDto>,
  res: Response,
) => {
  try {
    const existBlog: WithId<BlogType> | null =
      await blogsQueryRepository.getBlogById(req.params.id);

    if (!existBlog) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }

    res.json(blogMapper(existBlog));
  } catch (e) {
    errorsHandler(e, res);
  }
};
