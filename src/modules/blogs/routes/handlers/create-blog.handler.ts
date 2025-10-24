import { Response } from 'express';
import { RequestWithBody } from '../../../../core/types/request.type';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HTTP_STATUS } from '../../../../core/enums/http-status';
import { CreateBlogDto } from '../../dto/create-blog.dto';
import { BlogType } from '../../types/blog.type';
import { blogMapper } from '../mappers/blog.mapper';
import { WithId } from 'mongodb';

export const createBlogHandler = async (
  req: RequestWithBody<CreateBlogDto>,
  res: Response,
) => {
  try {
    const newBlog: WithId<BlogType> | null = await blogsRepository.createBlog(
      req.body,
    );

    if (!newBlog) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }

    res.status(HTTP_STATUS.CREATED_201).send(blogMapper(newBlog));
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
