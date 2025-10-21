import { Response } from 'express';
import { RequestWithBody } from '../../types/request.type';
import { blogsRepository } from '../../repository/blogs.repository';
import { HTTP_STATUS } from '../../enums/http-status';
import { CreateBlogDto } from '../../dto/blog/create-blog.dto';
import { BlogType } from '../../types/blog.type';
import { WithId } from 'mongodb';

export const createBlogController = async (
  req: RequestWithBody<CreateBlogDto>,
  res: Response,
) => {
  const newBlog: WithId<BlogType> | null = await blogsRepository.createBlog(
    req.body,
  );

  if (!newBlog) {
    res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    return;
  }

  res.status(HTTP_STATUS.CREATED_201).send(newBlog);
};
