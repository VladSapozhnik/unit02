import { Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { usersService } from '../../application/users.service';
import { RequestWithParam } from '../../../../core/types/request.type';
import { idUserParamDto } from '../../dto/id-user-param.dto';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';

export const removeUserHandler = async (
  req: RequestWithParam<idUserParamDto>,
  res: Response,
) => {
  const isRemove: boolean = await usersService.removeUser(req.params.id);

  if (!isRemove) {
    throw new NotFoundError('User is not found!', 'user');
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
