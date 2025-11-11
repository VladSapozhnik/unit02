import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../enums/http-status.enum';
import { jwtService } from '../../modules/jwt/application/jwt.service';

export const jwtAuthGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth: string | undefined = req.headers['authorization'];

    if (!auth) {
      res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
      return;
    }

    const [authType, token] = auth.split(' ');

    if (authType !== 'Bearer' || !token) {
      res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
      return;
    }

    const userId: string | null = await jwtService.verifyAccessToken(token);

    if (!userId) {
      res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
      return;
    }

    req.userId = userId;
    next();
  } catch (e) {
    next(e);
  }
};
