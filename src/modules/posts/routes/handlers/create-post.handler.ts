import { Response } from 'express';
import { CreatePostDto } from '../../dto/create-post.dto';
import { RequestWithBody } from '../../../../core/types/request.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { ObjectId } from 'mongodb';
import { PostType } from '../../types/post.type';
import { postsService } from '../../application/posts.service';
import { BadRequestError } from '../../../../core/errors/bad-request.error';
import { postsQueryRepository } from '../../repositories/posts.query.repository';

export const createPostHandler = async (
  req: RequestWithBody<CreatePostDto>,
  res: Response,
) => {
  const id: ObjectId = await postsService.createPost(req.body);

  if (!id) {
    throw new BadRequestError('Failed to create Post', 'post');
  }

  const post: PostType | null = await postsQueryRepository.getPostById(id);

  res.status(HTTP_STATUS.CREATED_201).send(post);
};
