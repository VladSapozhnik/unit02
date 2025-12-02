import { Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { usersService } from '../../application/users.service';
import { RequestWithParam } from '../../../../core/types/request.type';
import { IdUserParamDto } from '../../dto/id-user-param.dto';

export const removeUserHandler = async (
  req: RequestWithParam<IdUserParamDto>,
  res: Response,
) => {
  await usersService.removeUser(req.params.id);

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
