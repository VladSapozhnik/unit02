import {Router, Request, Response} from "express";
import {postsRepository} from "../repository/posts.repository";
import {HTTP_STATUS} from "../enums/http-status";
import {ResponsePostDto} from "../dto/post/response-post.dto";
import {generateId} from "../constants/generate-id";
import {basePostValidator} from "../validators/posts/base-post.validator";
import {inputValidationMiddleware} from "../middleware/input-validation.middleware";
import {superAdminGuardMiddleware} from "../middleware/super-admin-guard.middleware";
import {RequestWithBody, RequestWithParam, RequestWithParamAndBody} from "../types/request.type";
import {UpdatePostDto} from "../dto/post/update-post.dto";
import {CreatePostDto} from "../dto/post/create-post.dto";

export const postsRouter: Router = Router();

postsRouter.get('/', (req: Request, res: Response) => {
    const findPosts: ResponsePostDto[] = postsRepository.getAllPosts();

    res.json(findPosts);
})

postsRouter.post('/', superAdminGuardMiddleware, basePostValidator, inputValidationMiddleware, (req: RequestWithBody<CreatePostDto>, res: Response) => {
    const randomId = generateId();

    const isCreated: boolean = postsRepository.createPost(req.body, randomId);

    if (!isCreated) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    }

    const findPost: ResponsePostDto | undefined  = postsRepository.getPostById(randomId);

    res.status(HTTP_STATUS.CREATED_201).send(findPost);
})

postsRouter.get('/:id', (req: RequestWithParam<{id: string}>, res: Response) => {
    const existPost: ResponsePostDto | undefined = postsRepository.getPostById(req.params.id);

    if (!existPost) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }

    res.send(existPost);
})

postsRouter.put('/:id', superAdminGuardMiddleware, basePostValidator, inputValidationMiddleware, (req: RequestWithParamAndBody<{id: string}, UpdatePostDto>, res: Response) => {
    const isUpdatedPost: boolean = postsRepository.updatePost(req.params.id, req.body);

    if (!isUpdatedPost) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
})

postsRouter.delete('/:id', superAdminGuardMiddleware, (req: RequestWithParam<{id: string}>, res: Response) => {
    const isRemove: boolean = postsRepository.removePost(req.params.id);

    if (!isRemove) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
})