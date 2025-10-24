import { Response } from 'express';
import { RequestWithParam } from '../../../../core/types/request.type';
import { QueryPostDto } from '../../dto/query-post.dto';
import { PostType } from '../../types/post.type';
import { postsRepository } from '../../repositories/posts.repository';
import { HTTP_STATUS } from '../../../../core/enums/http-status';
import { WithId } from 'mongodb';
import { postMapper } from '../mappers/posts.mapper';

export const getPostByIdHandler = async (
  req: RequestWithParam<QueryPostDto>,
  res: Response,
) => {
  try {
    const existPost: WithId<PostType> | null =
      await postsRepository.getPostById(req.params.id);

    if (!existPost) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }

    res.send(postMapper(existPost));
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
