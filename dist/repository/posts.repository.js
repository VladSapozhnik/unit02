"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_1 = require("../db");
const blogs_repository_1 = require("./blogs.repository");
exports.postsRepository = {
    getAllPosts: () => {
        return db_1.db.posts.map((post) => post);
    },
    createPost: (body, id) => {
        const existBlog = blogs_repository_1.blogsRepository.getBlogById(body.blogId);
        if (!existBlog) {
            return false;
        }
        const newPost = Object.assign(Object.assign({ id }, body), { blogName: existBlog.name });
        db_1.db.posts.push(newPost);
        return true;
    },
    getPostById(id) {
        return db_1.db.posts.find((blog) => blog.id === id);
    },
    updatePost(id, body) {
        const existPost = exports.postsRepository.getPostById(id);
        if (existPost) {
            Object.assign(existPost, body);
            return true;
        }
        else {
            return false;
        }
    },
    removePost(id) {
        const existPost = exports.postsRepository.getPostById(id);
        if (existPost) {
            db_1.db.posts = db_1.db.posts.filter((post) => post.id !== id);
            return true;
        }
        else {
            return false;
        }
    },
};
