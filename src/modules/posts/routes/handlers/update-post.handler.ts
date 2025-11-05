import { Response } from 'express';
import { RequestWithParamAndBody } from '../../../../core/types/request.type';
import { idPostParamDto } from '../../dto/id-post-param.dto';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { postsService } from '../../application/posts.service';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';

export const updatePostHandler = async (
  req: RequestWithParamAndBody<idPostParamDto, UpdatePostDto>,
  res: Response,
) => {
  const isUpdate: boolean = await postsService.updatePost(
    req.params.id,
    req.body,
  );

  if (!isUpdate) {
    throw new NotFoundError('Failed to update Post', 'post');
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
