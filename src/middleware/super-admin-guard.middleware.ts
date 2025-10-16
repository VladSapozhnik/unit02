import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../enums/http-status';

export const ADMIN_USERNAME: string = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD || 'qwerty';

export const superAdminGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth: string | undefined = req.headers['authorization'];

  if (!auth) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const [authType, token] = auth.split(' ');

  if (authType !== 'Basic') {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
  }

  const credentials: string = Buffer.from(token, 'base64').toString('utf-8');

  const [user, password] = credentials.split(':');

  if (user !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  next();
};
