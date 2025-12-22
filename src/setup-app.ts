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
import { usersRouter } from './modules/users/routes/users.router';
import { errorsHandler } from './core/errors/errors.handler';
import { authRouter } from './modules/auth/routes/auth.router';
import { commentsRouter } from './modules/comments/routes/comments.router';
import cookieParser from 'cookie-parser';
import { securityDevicesRouter } from './modules/security-devices/routes/security-devices.router';
import { BlogModel } from './modules/blogs/entities/blog.entity';
import { CommentModel } from './modules/comments/entities/comment.entity';
import { PostModel } from './modules/posts/entities/post.entity';
import { UsersModel } from './modules/users/entities/user.entity';
import { SecurityDevicesModel } from './modules/security-devices/entities/security-devices.entity';
import { RateLimitModel } from './modules/rate-limit/entities/rate-limit.entity';
import { PasswordRecoveryModel } from './modules/password-recovery/entities/password-recovery.entity';
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
      BlogModel.deleteMany(),
      PostModel.deleteMany(),
      UsersModel.deleteMany(),
      CommentModel.deleteMany(),
      PasswordRecoveryModel.deleteMany(),
      SecurityDevicesModel.deleteMany(),
      RateLimitModel.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  });

  return app;
};
