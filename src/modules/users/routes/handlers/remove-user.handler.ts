import { NextFunction, Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { usersService } from '../../application/users.service';
import { RequestWithParam } from '../../../../core/types/request.type';
import { idUserParamDto } from '../../dto/id-user-param.dto';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';

export const removeUserHandler = async (
  req: RequestWithParam<idUserParamDto>,
  res: Response,
  next: NextFunction,
) => {
  const isRemove: boolean = await usersService.removeUser(req.params.id);

  if (!isRemove) {
    throw new NotFoundError('User is not found!', 'user');
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
