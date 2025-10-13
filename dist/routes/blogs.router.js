"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repository/blogs.repository");
const http_status_1 = require("../enums/http-status");
const uuid_1 = require("uuid");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get('/', (req, res) => {
    const findBlogs = blogs_repository_1.blogsRepository.getBlogs();
    res.send(findBlogs);
});
exports.blogsRouter.post('/', (req, res) => {
    const generateId = (0, uuid_1.v4)();
    const newBlog = blogs_repository_1.blogsRepository.createBlog(req.body, generateId);
    if (!newBlog) {
        res.sendStatus(http_status_1.HTTP_STATUS.BAD_REQUEST_400);
        return;
    }
    const findBlog = blogs_repository_1.blogsRepository.getBlogById(generateId);
    res.status(http_status_1.HTTP_STATUS.CREATED_201).send(findBlog);
});
exports.blogsRouter.get('/:id', (req, res) => {
    const existBlog = blogs_repository_1.blogsRepository.getBlogById(req.params.id);
    if (!existBlog) {
        res.sendStatus(http_status_1.HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    else {
        res.send(existBlog);
        return;
    }
});
exports.blogsRouter.put('/:id', (req, res) => {
    const isUpdated = blogs_repository_1.blogsRepository.updateBlog(req.params.id, req.body);
    if (isUpdated) {
        res.sendStatus(http_status_1.HTTP_STATUS.NO_CONTENT_204);
        return;
    }
    else {
        res.sendStatus(http_status_1.HTTP_STATUS.NOT_FOUND_404);
    }
});
exports.blogsRouter.delete('/:id', (req, res) => {
    const isDelete = blogs_repository_1.blogsRepository.removeBlogById(req.params.id);
    if (isDelete) {
        res.sendStatus(http_status_1.HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    else {
        res.sendStatus(http_status_1.HTTP_STATUS.NOT_FOUND_404);
        return;
    }
});
