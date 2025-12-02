import { RequestWithParam } from '../../../../core/types/request.type';
import { IdBlogParamDto } from '../../dto/id-blog-param.dto';
import { Response } from 'express';
import { BlogType } from '../../types/blog.type';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';

export const getBlogByIdHandler = async (
  req: RequestWithParam<IdBlogParamDto>,
  res: Response,
) => {
  const existBlog: BlogType | null = await blogsQueryRepository.getBlogById(
    req.params.id,
  );

  if (!existBlog) {
    throw new NotFoundError('blog is not found', 'blog');
  }

  res.json(existBlog);
};
