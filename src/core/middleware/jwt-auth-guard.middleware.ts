import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../enums/http-status.enum';
import { jwtService } from '../../modules/jwt/application/jwt.service';
import { ObjectId, WithId } from 'mongodb';
import { UserType } from '../../modules/users/type/user.type';
import { usersRepository } from '../../modules/users/repositories/users.repository';

export const jwtAuthGuardMiddleware = async (
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

  if (authType !== 'Bearer') {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }

  const userId: ObjectId | null = await jwtService.verifyAccessToken(token);

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

  req.user = isUser;
  next();
};
