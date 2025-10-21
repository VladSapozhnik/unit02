import { Response } from 'express';
import { CreatePostDto } from '../../dto/post/create-post.dto';
import { RequestWithBody } from '../../types/request.type';
import { postsRepository } from '../../repository/posts.repository';
import { HTTP_STATUS } from '../../enums/http-status';

export const createPostController = async (
  req: RequestWithBody<CreatePostDto>,
  res: Response,
) => {
  try {
    const post = await postsRepository.createPost(req.body);

    res.status(HTTP_STATUS.CREATED_201).send(post);
  } catch {
    res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
  }
};
