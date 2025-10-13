import {Router, Request, Response} from "express";
import {blogsRepository} from "../repository/blogs.repository";
import {ResponseBlogDto} from "../dto/blog/response-blog.dto";
import {HTTP_STATUS} from "../enums/http-status";
import { v4 as uuidv4 } from 'uuid';

export const blogsRouter: Router = Router();

blogsRouter.get('/', (req: Request, res: Response) => {
    const findBlogs: ResponseBlogDto[] = blogsRepository.getBlogs();

    res.send(findBlogs);
})

blogsRouter.post('/', (req: Request, res: Response) => {
    const generateId: string = uuidv4();
    const newBlog: boolean = blogsRepository.createBlog(req.body, generateId);

    if (!newBlog) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    }

    const findBlog: ResponseBlogDto | undefined = blogsRepository.getBlogById(generateId)

    res.status(HTTP_STATUS.CREATED_201).send(findBlog);
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    const existBlog: ResponseBlogDto | undefined = blogsRepository.getBlogById(req.params.id);

    if (!existBlog) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    } else {
        res.send(existBlog);
        return;
    }
})

blogsRouter.put('/:id', (req: Request, res: Response) => {
    const isUpdated: boolean = blogsRepository.updateBlog(req.params.id, req.body);

    if (isUpdated) {
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
        return;
    } else {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
})

blogsRouter.delete('/:id', (req, res) => {
    const isDelete: boolean = blogsRepository.removeBlogById(req.params.id);

    if (isDelete) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    } else {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }
})