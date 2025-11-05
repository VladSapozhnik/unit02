import { Request, Response } from 'express';
import { authService } from '../../application/auth.service';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';

export const loginHandler = async (req: Request, res: Response) => {
  const isLogin: boolean = await authService.login(req.body);

  if (!isLogin) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
