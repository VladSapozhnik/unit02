import express, {
  type Request,
  type Response,
  type Express,
  type NextFunction,
} from 'express';
import { blogsRouter } from './modules/blogs/routes/blogs.router';
import { postsRouter } from './modules/posts/routes/posts.router';
import { HTTP_STATUS } from './core/enums/http-status.enum';
import { RouterPathConst } from './core/constants/router-path.const';
import {
  BlogsModel,
  CommentsModel,
  PasswordRecoveryModel,
  PostsModel,
  RateLimitModel,
  SecurityDevicesModel,
  UsersModel,
} from './core/db/mango.db';
import { usersRouter } from './modules/users/routes/users.router';
import { errorsHandler } from './core/errors/errors.handler';
import { authRouter } from './modules/auth/routes/auth.router';
import { commentsRouter } from './modules/comments/routes/comments.router';
import cookieParser from 'cookie-parser';
import { securityDevicesRouter } from './modules/security-devices/routes/security-devices.router';
// import crone from 'node-cron';
// import { blacklistRepository } from './modules/blacklist/repositories/blacklist.repository';

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cookieParser());
  app.set('trust proxy', true);

  app.get('/', (req, res) => {
    res.send('Main page!');
  });

  app.use(RouterPathConst.blogs, blogsRouter);
  app.use(RouterPathConst.posts, postsRouter);
  app.use(RouterPathConst.users, usersRouter);
  app.use(RouterPathConst.auth, authRouter);
  app.use(RouterPathConst.comments, commentsRouter);
  app.use(RouterPathConst.securityDevices, securityDevicesRouter);

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    errorsHandler(err, res);
  });

  // crone.schedule('*/30 * * * *', async () => {
  //   try {
  //     await blacklistRepository.cleanExpiredBlacklist();
  //     console.log('clear blacklist');
  //   } catch (e) {
  //     console.error(e);
  //   }
  // });

  app.delete(RouterPathConst.__tests__, async (req: Request, res: Response) => {
    await Promise.all([
      BlogsModel.deleteMany(),
      PostsModel.deleteMany(),
      UsersModel.deleteMany(),
      CommentsModel.deleteMany(),
      PasswordRecoveryModel.deleteMany(),
      SecurityDevicesModel.deleteMany(),
      RateLimitModel.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  });

  return app;
};
