import { Response } from 'express';
import { authService } from '../../application/auth.service';
import { RequestWithBody } from '../../../../core/types/request.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { ConfirmEmailDto } from '../../dto/confirm-email.dto';
import { ResultStatus } from '../../../../core/enums/result-status.enum';

export const confirmEmailHandler = async (
  req: RequestWithBody<ConfirmEmailDto>,
  res: Response,
) => {
  const { status } = await authService.confirmEmail(req.body.code);

  if (status === ResultStatus.BadRequest) {
    res.sendStatus(400);
    return;
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
