import { Response } from 'express';
import { RequestWithParam } from '../../types/request.type';
import { QueryPostDto } from '../../dto/post/query-post.dto';
import { PostType } from '../../types/post.type';
import { postsRepository } from '../../repository/posts.repository';
import { HTTP_STATUS } from '../../enums/http-status';
import { WithId } from 'mongodb';

export const getPostByIdController = async (
  req: RequestWithParam<QueryPostDto>,
  res: Response,
) => {
  const existPost: WithId<PostType> | null = await postsRepository.getPostById(
    req.params.id,
  );

  if (!existPost) {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    return;
  }

  res.send(existPost);
};
