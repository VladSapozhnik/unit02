import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../enums/http-status.enum';
import { UserDbType } from '../../modules/users/type/user.type';
import { jwtAdapter } from '../adapters/jwt.adapter';
import { inject, injectable } from 'inversify';
import { UsersRepository } from '../../modules/users/repositories/users.repository';

@injectable()
export class AuthGuardMiddleware {
  constructor(
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async jwtAuth(req: Request, res: Response, next: NextFunction) {
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

      const userId: string | null = await jwtAdapter.verifyAccessToken(token);

      if (!userId) {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
        return;
      }

      const isUser: UserDbType | null =
        await this.usersRepository.getUserById(userId);

      if (!isUser || !isUser._id) {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
        return;
      }

      req.userId = isUser._id.toString() as string;
      next();
    } catch (e) {
      next(e);
    }
  }
}
