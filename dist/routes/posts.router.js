"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_repository_1 = require("../repository/posts.repository");
const http_status_1 = require("../enums/http-status");
const generate_id_1 = require("../constants/generate-id");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', (req, res) => {
    const findPosts = posts_repository_1.postsRepository.getAllPosts();
    res.json(findPosts);
});
exports.postsRouter.post('/', (req, res) => {
    const randomId = (0, generate_id_1.generateId)();
    const isCreated = posts_repository_1.postsRepository.createPost(req.body, randomId);
    if (!isCreated) {
        res.sendStatus(http_status_1.HTTP_STATUS.BAD_REQUEST_400);
        return;
    }
    const findPost = posts_repository_1.postsRepository.getPostById(randomId);
    res.send(findPost);
});
exports.postsRouter.get('/:id', (req, res) => {
    const existPost = posts_repository_1.postsRepository.getPostById(req.params.id);
    if (!existPost) {
        res.sendStatus(http_status_1.HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    res.send(existPost);
});
exports.postsRouter.put('/:id', (req, res) => {
    const isUpdatedPost = posts_repository_1.postsRepository.updatePost(req.params.id, req.body);
    if (!isUpdatedPost) {
        res.sendStatus(http_status_1.HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    res.sendStatus(http_status_1.HTTP_STATUS.NO_CONTENT_204);
});
exports.postsRouter.delete('/:id', (req, res) => {
    const isRemove = posts_repository_1.postsRepository.removePost(req.params.id);
    if (!isRemove) {
        res.sendStatus(http_status_1.HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    res.sendStatus(http_status_1.HTTP_STATUS.NO_CONTENT_204);
});
