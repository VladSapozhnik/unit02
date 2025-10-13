import express, {Request, Response} from 'express';
import {blogsRouter} from "./routes/blogs.router";
import {postsRouter} from "./routes/posts.router";
import {HTTP_STATUS} from "./enums/http-status";
import {db} from "./db";

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Main page!')
})

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.posts = [];
    db.blogs = [];
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})
