import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { cookieAdapter } from '../../../../core/adapters/cookie.adapter';
import { UnauthorizedError } from '../../../../core/errors/unauthorized.error';
import { jwtAdapter } from '../../../../core/adapters/jwt.adapter';
import { JwtPayload } from 'jsonwebtoken';
import { authService } from '../../application/auth.service';

export const logoutHandler = async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    throw new UnauthorizedError('Unauthorized', 'logout');
  }
  let payload: JwtPayload;
  try {
    payload = jwtAdapter.verifyRefreshToken(oldRefreshToken) as JwtPayload;
  } catch {
    throw new UnauthorizedError('Unauthorized', 'logout');
  }

  const userId: string = payload.userId;

  await authService.saveRefreshToken(userId, '');

  cookieAdapter.clearRefreshCookie(res);

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
