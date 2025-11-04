import { Response } from 'express';
import { RequestWithParam } from '../../../../core/types/request.type';
import { idPostParamDto } from '../../dto/id-post-param.dto';
import { PostType } from '../../types/post.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { WithId } from 'mongodb';
import { postMapper } from '../mappers/posts.mapper';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { postsQueryRepository } from '../../repositories/posts.query.repository';

export const getPostByIdHandler = async (
  req: RequestWithParam<idPostParamDto>,
  res: Response,
) => {
  try {
    const existPost: WithId<PostType> | null =
      await postsQueryRepository.getPostById(req.params.id);

    if (!existPost) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      return;
    }

    res.send(postMapper(existPost));
  } catch (e) {
    errorsHandler(e, res);
  }
};
