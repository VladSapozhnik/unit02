import { Response } from 'express';
import { CreatePostDto } from '../../dto/create-post.dto';
import { RequestWithBody } from '../../../../core/types/request.type';
import { postsRepository } from '../../repositories/posts.repository';
import { HTTP_STATUS } from '../../../../core/enums/http-status';
import { postMapper } from '../mappers/posts.mapper';
import { WithId } from 'mongodb';
import { PostType } from '../../types/post.type';
import { BlogType } from '../../../blogs/types/blog.type';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';

export const createPostHandler = async (
  req: RequestWithBody<CreatePostDto>,
  res: Response,
) => {
  try {
    const existBlog: BlogType | null = await blogsRepository.getBlogById(
      req.body.blogId,
    );
    if (!existBlog) return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);

    const post: boolean | WithId<PostType> = await postsRepository.createPost(
      req.body,
      existBlog.name,
    );
    if (!post) return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);

    res
      .status(HTTP_STATUS.CREATED_201)
      .send(postMapper(post as WithId<PostType>));
  } catch {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
