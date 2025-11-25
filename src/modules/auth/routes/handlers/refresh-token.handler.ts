import { Request, Response } from 'express';
import { cookieAdapter } from '../../../../core/adapters/cookie.adapter';
import { authService } from '../../application/auth.service';

export const refreshTokenHandler = async (req: Request, res: Response) => {
  const oldRefreshToken: string = req.cookies.refreshToken;

  const { accessToken, refreshToken } =
    await authService.refreshToken(oldRefreshToken);

  cookieAdapter.setRefreshCookie(res, refreshToken);

  res.json({ accessToken });
};
