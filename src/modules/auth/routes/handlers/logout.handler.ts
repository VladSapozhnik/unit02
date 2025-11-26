import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { cookieAdapter } from '../../../../core/adapters/cookie.adapter';
import { authService } from '../../application/auth.service';

export const logoutHandler = async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies.refreshToken as string;

  await authService.logout(oldRefreshToken);

  cookieAdapter.clearRefreshCookie(res);

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
