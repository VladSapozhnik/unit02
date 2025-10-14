import {Router} from "express";
import {postsRepository} from "../repository/posts.repository";
import {HTTP_STATUS} from "../enums/http-status";
import {ResponsePostDto} from "../dto/post/response-post.dto";
import {generateId} from "../constants/generate-id";

export const postsRouter: Router = Router();

postsRouter.get('/', (req, res) => {
    const findPosts: ResponsePostDto[] = postsRepository.getAllPosts();

    res.json(findPosts);
})

postsRouter.post('/', (req, res) => {
    const randomId = generateId();

    const isCreated: boolean = postsRepository.createPost(req.body, randomId);

    if (!isCreated) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    }

    const findPost: ResponsePostDto | undefined  = postsRepository.getPostById(randomId);

    res.status(HTTP_STATUS.CREATED_201).send(findPost);
})

postsRouter.get('/:id', (req, res) => {
    const existPost: ResponsePostDto | undefined = postsRepository.getPostById(req.params.id);

    if (!existPost) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }

    res.send(existPost);
})

postsRouter.put('/:id', (req, res) => {
    const isUpdatedPost: boolean = postsRepository.updatePost(req.params.id, req.body);

    if (!isUpdatedPost) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
})

postsRouter.delete('/:id', (req, res) => {
    const isRemove: boolean = postsRepository.removePost(req.params.id);

    if (!isRemove) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
})