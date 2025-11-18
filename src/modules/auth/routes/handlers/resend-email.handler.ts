import { Response } from 'express';
import { authService } from '../../application/auth.service';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { RequestWithBody } from '../../../../core/types/request.type';
import { ResendEmailDto } from '../../dto/resend-email.dto';

export const resendEmailHandler = async (
  req: RequestWithBody<ResendEmailDto>,
  res: Response,
) => {
  await authService.resendEmail(req.body.email);

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
