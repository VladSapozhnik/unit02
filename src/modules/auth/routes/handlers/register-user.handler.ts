import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { authService } from '../../application/auth.service';

export const registerUserHandler = async (req: Request, res: Response) => {
  await authService.registration(req.body);

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
