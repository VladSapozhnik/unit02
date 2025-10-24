import express, { type Request, type Response, type Express } from 'express';
import { blogsRouter } from './modules/blogs/routes/blogs.router';
import { postsRouter } from './modules/posts/routes/posts.router';
import { HTTP_STATUS } from './core/enums/http-status';
import { RouterPath } from './core/constants/router-path';
import { blogCollection, postCollection } from './core/db/mango.db';

export const app = express();
export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Main page!');
  });

  app.use(RouterPath.blogs, blogsRouter);
  app.use(RouterPath.posts, postsRouter);

  app.delete(RouterPath.__tests__, async (req: Request, res: Response) => {
    await Promise.all([
      blogCollection.deleteMany(),
      postCollection.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  });

  return app;
};
