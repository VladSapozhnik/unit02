import { Request, Response } from 'express';
import { BlogType } from '../../types/blog.type';
import { blogsRepository } from '../../repository/blogs.repository';
import { WithId } from 'mongodb';

export const getAllBlogsController = async (req: Request, res: Response) => {
  const findBlogs: WithId<BlogType>[] = await blogsRepository.getBlogs();

  res.send(findBlogs);
};
