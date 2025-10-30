import { Response } from 'express';
import { RequestWithBody } from '../../../../core/types/request.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { CreateBlogDto } from '../../dto/create-blog.dto';
import { BlogType } from '../../types/blog.type';
import { blogMapper } from '../mappers/blog.mapper';
import { WithId } from 'mongodb';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const createBlogHandler = async (
  req: RequestWithBody<CreateBlogDto>,
  res: Response,
) => {
  try {
    const createdBlog: WithId<BlogType> | null = await blogsService.createBlog(
      req.body,
    );

    if (!createdBlog) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }

    res.status(HTTP_STATUS.CREATED_201).send(blogMapper(createdBlog));
  } catch (e) {
    errorsHandler(e, res);
  }
};
