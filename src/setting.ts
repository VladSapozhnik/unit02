import express, {Request, Response} from 'express';
import {blogsRouter} from "./routes/blogs.router";
import {postsRouter} from "./routes/posts.router";
import {HTTP_STATUS} from "./enums/http-status";
import {db} from "./db";
import {RouterPath} from "./constants/router-path";

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Main page!')
})

app.use(RouterPath.blogs, blogsRouter);
app.use(RouterPath.posts, postsRouter);

app.delete(RouterPath.__tests__, (req: Request, res: Response) => {
    db.posts = [];
    db.blogs = [];
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})

