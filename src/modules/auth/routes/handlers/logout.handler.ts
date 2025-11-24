import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { cookieAdapter } from '../../../../core/adapters/cookie.adapter';

export const logoutHandler = async (req: Request, res: Response) => {
  cookieAdapter.clearRefreshCookie(res);

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
