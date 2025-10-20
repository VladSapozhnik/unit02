import { Response } from 'express';
import { CreatePostDto } from '../../dto/post/create-post.dto';
import { RequestWithBody } from '../../types/request.type';
import { generateId } from '../../constants/generate-id';
import { postsRepository } from '../../repository/posts.repository';
import { HTTP_STATUS } from '../../enums/http-status';
import { PostType } from '../../types/post.type';

export const createPostController = async (
  req: RequestWithBody<CreatePostDto>,
  res: Response,
) => {
  const randomId = generateId();

  const isCreated: boolean = await postsRepository.createPost(
    req.body,
    randomId,
  );

  if (!isCreated) {
    res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    return;
  }

  const findPost: PostType | undefined =
    await postsRepository.getPostById(randomId);

  res.status(HTTP_STATUS.CREATED_201).send(findPost);
};
