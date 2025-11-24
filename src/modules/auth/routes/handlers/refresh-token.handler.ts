import { Request, Response } from 'express';
import { jwtAdapter } from '../../../../core/adapters/jwt.adapter';
import { cookieAdapter } from '../../../../core/adapters/cookie.adapter';
import { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../../../../core/errors/unauthorized.error';
import { authService } from '../../application/auth.service';

export const refreshTokenHandler = async (req: Request, res: Response) => {
  const oldRefreshToken: string = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    throw new UnauthorizedError('Unauthorized', 'refreshToken');
  }

  let payload: JwtPayload;
  try {
    payload = jwtAdapter.verifyRefreshToken(oldRefreshToken) as JwtPayload;
  } catch {
    throw new UnauthorizedError('Unauthorized', 'refreshToken');
  }

  const userId: string = payload.userId as string;

  const accessToken: string = await jwtAdapter.createAccessToken(userId);
  const refreshToken: string = await jwtAdapter.createRefreshToken(userId);

  await authService.saveRefreshToken(userId, refreshToken);

  cookieAdapter.setRefreshCookie(res, refreshToken);

  res.json({ accessToken });
};
