import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../enums/http-status.enum';

import { usersRepository } from '../../modules/users/repositories/users.repository';
import { WithId } from 'mongodb';
import { UserType } from '../../modules/users/type/user.type';
import { jwtService } from '../jwt/jwt.service';

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

    const isUser: WithId<UserType> | null =
      await usersRepository.getUserById(userId);

    if (!isUser || !isUser._id) {
      res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
      return;
    }

    req.userId = isUser._id.toString() as string;
    next();
  } catch (e) {
    next(e);
  }
};
