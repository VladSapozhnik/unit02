import { Response } from 'express';
import { isProdHelper } from '../helpers/is-prod.helper';

export const cookieAdapter = {
  setRefreshCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: isProdHelper(),
      maxAge: 20_000,
    });
  },
  clearRefreshCookie(res: Response) {
    res.clearCookie('refreshToken');
  },
};
