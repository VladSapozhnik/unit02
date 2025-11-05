import { Response } from 'express';
import { ObjectId } from 'mongodb';
import { PostType } from '../../types/post.type';
import { postsService } from '../../application/posts.service';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { RequestWithParamAndBody } from '../../../../core/types/request.type';
import { CreatePostForBlogDto } from '../../dto/create-post.dto';
import { BlogIdQueryDto } from '../../dto/blogId-query.dto';
import { BadRequestError } from '../../../../core/errors/bad-request.error';
import { postsQueryRepository } from '../../repositories/posts.query.repository';

export const createPostForBlogHandler = async (
  req: RequestWithParamAndBody<BlogIdQueryDto, CreatePostForBlogDto>,
  res: Response,
) => {
  const blogId: string = req.params.blogId;

  const id: ObjectId = await postsService.createPostForBlog({
    ...req.body,
    blogId,
  });

  if (!id) {
    throw new BadRequestError('Failed to create Post', 'post');
  }

  const post: PostType | null = await postsQueryRepository.getPostById(id);

  res.status(HTTP_STATUS.CREATED_201).send(post);
};
