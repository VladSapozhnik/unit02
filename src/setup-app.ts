import express, { type Request, type Response, type Express } from 'express';
import { blogsRouter } from './modules/blogs/routes/blogs.router';
import { postsRouter } from './modules/posts/routes/posts.router';
import { HTTP_STATUS } from './core/enums/http-status.enum';
import { RouterPathConst } from './core/constants/router-path.const';
import { blogCollection, postCollection } from './core/db/mango.db';
import { usersRouter } from './modules/users/routes/users.router';

export const app = express();
export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Main page!');
  });

  app.use(RouterPathConst.blogs, blogsRouter);
  app.use(RouterPathConst.posts, postsRouter);
  app.use(RouterPathConst.users, usersRouter);

  app.delete(RouterPathConst.__tests__, async (req: Request, res: Response) => {
    await Promise.all([
      blogCollection.deleteMany(),
      postCollection.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  });

  return app;
};
