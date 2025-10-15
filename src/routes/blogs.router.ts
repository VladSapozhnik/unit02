import {Router, Request, Response} from "express";
import {blogsRepository} from "../repository/blogs.repository";
import {ResponseBlogDto} from "../dto/blog/response-blog.dto";
import {HTTP_STATUS} from "../enums/http-status";
import {generateId} from "../constants/generate-id";
import { baseBlogValidator } from "../validators/blogs/base-blog.validator";
import {inputValidationMiddleware} from "../middleware/input-validation.middleware";
import {superAdminGuardMiddleware} from "../middleware/super-admin-guard.middleware";
import {RequestWithBody, RequestWithParam, RequestWithParamAndBody} from "../types/request.type";
import {CreateBlogDto} from "../dto/blog/create-blog.dto";
import {UpdateBlogDto} from "../dto/blog/update-blog.dto";

export const blogsRouter: Router = Router();

blogsRouter.get('/', (req: Request, res: Response) => {
    const findBlogs: ResponseBlogDto[] = blogsRepository.getBlogs();

    res.send(findBlogs);
})

blogsRouter.post('/', superAdminGuardMiddleware, baseBlogValidator, inputValidationMiddleware, (req: RequestWithBody<CreateBlogDto>, res: Response) => {
    const randomId = generateId();

    const newBlog: boolean = blogsRepository.createBlog(req.body, randomId);

    if (!newBlog) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    }

    const findBlog: ResponseBlogDto | undefined = blogsRepository.getBlogById(randomId)

    res.status(HTTP_STATUS.CREATED_201).send(findBlog);
})

blogsRouter.get('/:id', (req: RequestWithParam<{id: string}>, res: Response) => {
    const existBlog: ResponseBlogDto | undefined = blogsRepository.getBlogById(req.params.id);

    if (!existBlog) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    } else {
        res.send(existBlog);
        return;
    }
})

blogsRouter.put('/:id', superAdminGuardMiddleware, baseBlogValidator, inputValidationMiddleware, (req: RequestWithParamAndBody<{id: string}, UpdateBlogDto>, res: Response) => {
    const isUpdated: boolean = blogsRepository.updateBlog(req.params.id, req.body);

    if (isUpdated) {
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
        return;
    } else {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
})

blogsRouter.delete('/:id', superAdminGuardMiddleware, (req: RequestWithParam<{id: string}>, res: Response) => {
    const isDelete: boolean = blogsRepository.removeBlogById(req.params.id);

    if (!isDelete) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
})