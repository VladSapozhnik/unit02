import { Request, Response } from 'express';
import { jwtAdapter } from '../../../../core/adapters/jwt.adapter';
import { cookieAdapter } from '../../../../core/adapters/cookie.adapter';
import { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../../../../core/errors/unauthorized.error';

export const refreshTokenHandler = async (req: Request, res: Response) => {
  const userId: string = req.userId as string;

  const oldRefreshToken: string = req.cookies.refreshToken;

  let payload: JwtPayload;
  try {
    payload = jwtAdapter.verifyRefreshToken(oldRefreshToken) as JwtPayload;
  } catch {
    throw new UnauthorizedError('Unauthorized', 'auth');
  }

  if (!payload) {
    throw new UnauthorizedError('Unauthorized', 'auth');
  }

  const accessToken: string = await jwtAdapter.createAccessToken(userId);
  const refreshToken: string = await jwtAdapter.createRefreshToken(userId);

  cookieAdapter.setRefreshCookie(res, refreshToken);

  res.json({ accessToken });
};
