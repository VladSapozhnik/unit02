import { NextFunction, Response } from 'express';
import { RequestWithBody } from '../../../../core/types/request.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { CreateBlogDto } from '../../dto/create-blog.dto';
import { BlogType } from '../../types/blog.type';
import { ObjectId } from 'mongodb';
import { blogsService } from '../../application/blogs.service';
import { BadRequestError } from '../../../../core/errors/bad-request.error';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';

export const createBlogHandler = async (
  req: RequestWithBody<CreateBlogDto>,
  res: Response,
  next: NextFunction,
) => {
  const id: ObjectId = await blogsService.createBlog(req.body);

  if (!id) {
    throw new BadRequestError('Failed to create blog', 'blog');
  }

  const findCreatedBlog: BlogType | null =
    await blogsQueryRepository.getBlogById(id);

  res.status(HTTP_STATUS.CREATED_201).send(findCreatedBlog);
};
