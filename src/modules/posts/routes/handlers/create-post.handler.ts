import { Response } from 'express';
import { CreatePostDto } from '../../dto/create-post.dto';
import { RequestWithBody } from '../../../../core/types/request.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { postMapper } from '../mappers/posts.mapper';
import { WithId } from 'mongodb';
import { PostType } from '../../types/post.type';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const createPostHandler = async (
  req: RequestWithBody<CreatePostDto>,
  res: Response,
) => {
  try {
    const isCreatedPost: boolean | WithId<PostType> =
      await postsService.createPost(req.body);

    if (!isCreatedPost) return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);

    res
      .status(HTTP_STATUS.CREATED_201)
      .send(postMapper(isCreatedPost as WithId<PostType>));
  } catch (e) {
    errorsHandler(e, res);
  }
};
