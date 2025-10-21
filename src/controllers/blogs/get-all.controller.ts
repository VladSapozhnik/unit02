import { Request, Response } from 'express';
import { BlogType } from '../../types/blog.type';
import { blogsRepository } from '../../repository/blogs.repository';
import { WithId } from 'mongodb';
import { HTTP_STATUS } from '../../enums/http-status';

export const getAllBlogsController = async (req: Request, res: Response) => {
  try {
    const findBlogs: WithId<BlogType>[] = await blogsRepository.getBlogs();

    res.send(findBlogs);
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
