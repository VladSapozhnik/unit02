'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.app = void 0;
const express_1 = __importDefault(require('express'));
const blogs_router_1 = require('./routes/blogs.router');
const posts_router_1 = require('./routes/posts.router');
const http_status_1 = require('./enums/http-status');
const db_1 = require('./db');
const router_path_1 = require('./constants/router-path');
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.get('/', (req, res) => {
  res.send('Main page!');
});
exports.app.use(router_path_1.RouterPath.blogs, blogs_router_1.blogsRouter);
exports.app.use(router_path_1.RouterPath.posts, posts_router_1.postsRouter);
exports.app.delete(router_path_1.RouterPath.__tests__, (req, res) => {
  db_1.db.posts = [];
  db_1.db.blogs = [];
  res.sendStatus(http_status_1.HTTP_STATUS.NO_CONTENT_204);
});
