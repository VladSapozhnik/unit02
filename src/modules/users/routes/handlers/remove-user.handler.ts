import { Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { usersService } from '../../application/users.service';
import { RequestWithParam } from '../../../../core/types/request.type';
import { idUserParamDto } from '../../dto/id-user-param.dto';

export const removeUserHandler = async (
  req: RequestWithParam<idUserParamDto>,
  res: Response,
) => {
  try {
    await usersService.removeUser(req.params.id);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  } catch (e) {
    errorsHandler(e, res);
  }
};
