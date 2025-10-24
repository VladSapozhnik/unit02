import { Request, Response } from 'express';
import { BlogType } from '../../types/blog.type';
import { blogsRepository } from '../../repositories/blogs.repository';
import { WithId } from 'mongodb';
import { HTTP_STATUS } from '../../../../core/enums/http-status';
import { blogMapper } from '../mappers/blog.mapper';

export const getAllBlogsController = async (req: Request, res: Response) => {
  try {
    const findBlogs: WithId<BlogType>[] = await blogsRepository.getBlogs();

    const blogs: BlogType[] = findBlogs.map(blogMapper);

    res.send(blogs);
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
