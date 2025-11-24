import express, { type Request, type Response, type Express } from 'express';
import { blogsRouter } from './modules/blogs/routes/blogs.router';
import { postsRouter } from './modules/posts/routes/posts.router';
import { HTTP_STATUS } from './core/enums/http-status.enum';
import { RouterPathConst } from './core/constants/router-path.const';
import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  usersCollection,
} from './core/db/mango.db';
import { usersRouter } from './modules/users/routes/users.router';
import { errorsHandler } from './core/errors/errors.handler';
import { authRouter } from './modules/auth/routes/auth.router';
import { commentsRouter } from './modules/comments/routes/comments.router';
import cookieParser from 'cookie-parser';

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (req: Request, res: Response) => {
    res.send('Main page!');
  });

  app.use(RouterPathConst.blogs, blogsRouter);
  app.use(RouterPathConst.posts, postsRouter);
  app.use(RouterPathConst.users, usersRouter);
  app.use(RouterPathConst.auth, authRouter);
  app.use(RouterPathConst.comments, commentsRouter);

  app.use((err: unknown, req: Request, res: Response) => {
    errorsHandler(err, res);
  });

  app.delete(RouterPathConst.__tests__, async (req: Request, res: Response) => {
    await Promise.all([
      blogsCollection.deleteMany(),
      postsCollection.deleteMany(),
      usersCollection.deleteMany(),
      commentsCollection.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  });

  return app;
};
