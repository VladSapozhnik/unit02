import { Response } from 'express';
import { CreatePostDto } from '../../dto/post/create-post.dto';
import { RequestWithBody } from '../../types/request.type';
import { postsRepository } from '../../repository/posts.repository';
import { HTTP_STATUS } from '../../enums/http-status';
import { postMapper } from '../../mappers/posts.mapper';
import { WithId } from 'mongodb';
import { PostType } from '../../types/post.type';

export const createPostController = async (
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
