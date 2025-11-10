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
  blogCollection,
  commentCollection,
  postCollection,
  userCollection,
} from './core/db/mango.db';
import { usersRouter } from './modules/users/routes/users.router';
import { errorsHandler } from './core/errors/errors.handler';
import { authRouter } from './modules/auth/routes/auth.router';

export const app = express();
export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Main page!');
  });

  app.use(RouterPathConst.blogs, blogsRouter);
  app.use(RouterPathConst.posts, postsRouter);
  app.use(RouterPathConst.users, usersRouter);
  app.use(RouterPathConst.auth, authRouter);

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    errorsHandler(err, res);
  });

  app.delete(RouterPathConst.__tests__, async (req: Request, res: Response) => {
    await Promise.all([
      blogCollection.deleteMany(),
      postCollection.deleteMany(),
      userCollection.deleteMany(),
      commentCollection.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  });

  return app;
};
