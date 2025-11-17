import { Response } from 'express';
import { authService } from '../../application/auth.service';
import { RequestWithQuery } from '../../../../core/types/request.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { ConfirmEmailDto } from '../../dto/confirm-email.dto';

export const confirmEmailHandler = async (
  req: RequestWithQuery<ConfirmEmailDto>,
  res: Response,
) => {
  await authService.confirmEmail(req.query.code);

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
