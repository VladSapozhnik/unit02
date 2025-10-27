import { Request, Response } from 'express';
import { BlogType } from '../../types/blog.type';
import { WithId } from 'mongodb';
import { HTTP_STATUS } from '../../../../core/enums/http-status';
import { blogMapper } from '../../application/mappers/blog.mapper';
import { blogsService } from '../../application/blogs.service';

export const getAllBlogsController = async (req: Request, res: Response) => {
  try {
    const blogsFromDb: WithId<BlogType>[] = await blogsService.getBlogs();

    const blogs: BlogType[] = blogsFromDb.map(blogMapper);

    res.send(blogs);
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
