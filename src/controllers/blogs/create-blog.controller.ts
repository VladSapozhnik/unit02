import { Response } from 'express';
import { RequestWithBody } from '../../types/request.type';
import { generateId } from '../../constants/generate-id';
import { blogsRepository } from '../../repository/blogs.repository';
import { HTTP_STATUS } from '../../enums/http-status';
import { CreateBlogDto } from '../../dto/blog/create-blog.dto';
import { ResponseBlogDto } from '../../dto/blog/response-blog.dto';

export const createBlogController = async (
  req: RequestWithBody<CreateBlogDto>,
  res: Response,
) => {
  const randomId = generateId();

  const newBlog: boolean = blogsRepository.createBlog(req.body, randomId);

  if (!newBlog) {
    res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    return;
  }

  const findBlog: ResponseBlogDto | undefined =
    blogsRepository.getBlogById(randomId);

  res.status(HTTP_STATUS.CREATED_201).send(findBlog);
};
