import { Response } from 'express';
import { CreatePostDto } from '../../dto/create-post.dto';
import { RequestWithBody } from '../../../../core/types/request.type';
import { postsRepository } from '../../repositories/posts.repository';
import { HTTP_STATUS } from '../../../../core/enums/http-status';
import { postMapper } from '../mappers/posts.mapper';
import { WithId } from 'mongodb';
import { PostType } from '../../types/post.type';

export const createPostHandler = async (
  req: RequestWithBody<CreatePostDto>,
  res: Response,
) => {
  try {
    const post: boolean | WithId<PostType> = await postsRepository.createPost(
      req.body,
    );

    if (!post) {
      res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
      return;
    }

    res
      .status(HTTP_STATUS.CREATED_201)
      .send(postMapper(post as WithId<PostType>));
  } catch {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
