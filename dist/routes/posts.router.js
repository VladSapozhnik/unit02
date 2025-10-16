"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_repository_1 = require("../repository/posts.repository");
const http_status_1 = require("../enums/http-status");
const generate_id_1 = require("../constants/generate-id");
const base_post_validator_1 = require("../validators/posts/base-post.validator");
const input_validation_middleware_1 = require("../middleware/input-validation.middleware");
const super_admin_guard_middleware_1 = require("../middleware/super-admin-guard.middleware");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', (req, res) => {
    const findPosts = posts_repository_1.postsRepository.getAllPosts();
    res.json(findPosts);
});
exports.postsRouter.post('/', super_admin_guard_middleware_1.superAdminGuardMiddleware, base_post_validator_1.basePostValidator, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const randomId = (0, generate_id_1.generateId)();
    const isCreated = posts_repository_1.postsRepository.createPost(req.body, randomId);
    if (!isCreated) {
        res.sendStatus(http_status_1.HTTP_STATUS.BAD_REQUEST_400);
        return;
    }
    const findPost = posts_repository_1.postsRepository.getPostById(randomId);
    res.status(http_status_1.HTTP_STATUS.CREATED_201).send(findPost);
});
exports.postsRouter.get('/:id', (req, res) => {
    const existPost = posts_repository_1.postsRepository.getPostById(req.params.id);
    if (!existPost) {
        res.sendStatus(http_status_1.HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    res.send(existPost);
});
exports.postsRouter.put('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, base_post_validator_1.basePostValidator, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const isUpdatedPost = posts_repository_1.postsRepository.updatePost(req.params.id, req.body);
    if (!isUpdatedPost) {
        res.sendStatus(http_status_1.HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    res.sendStatus(http_status_1.HTTP_STATUS.NO_CONTENT_204);
});
exports.postsRouter.delete('/:id', super_admin_guard_middleware_1.superAdminGuardMiddleware, (req, res) => {
    const isRemove = posts_repository_1.postsRepository.removePost(req.params.id);
    if (!isRemove) {
        res.sendStatus(http_status_1.HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    res.sendStatus(http_status_1.HTTP_STATUS.NO_CONTENT_204);
});
