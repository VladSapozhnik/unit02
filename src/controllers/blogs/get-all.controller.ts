import { Request, Response } from 'express';
import { ResponseBlogDto } from '../../dto/blog/response-blog.dto';
import { blogsRepository } from '../../repository/blogs.repository';

export const getAllBlogsController = async (req: Request, res: Response) => {
  const findBlogs: ResponseBlogDto[] = blogsRepository.getBlogs();

  res.send(findBlogs);
};
