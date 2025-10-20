import { Response } from 'express';
import { RequestWithParam } from '../../types/request.type';
import { QueryPostDto } from '../../dto/post/query-post.dto';
import { ResponsePostDto } from '../../dto/post/response-post.dto';
import { postsRepository } from '../../repository/posts.repository';
import { HTTP_STATUS } from '../../enums/http-status';

export const getPostByIdController = async (
  req: RequestWithParam<QueryPostDto>,
  res: Response,
) => {
  const existPost: ResponsePostDto | undefined = postsRepository.getPostById(
    req.params.id,
  );

  if (!existPost) {
    res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    return;
  }

  res.send(existPost);
};
