"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../db");
exports.blogsRepository = {
    getBlogs() {
        return db_1.db.blogs.map((blog) => blog);
    },
    createBlog(body, id) {
        const newBlog = Object.assign({ id }, body);
        db_1.db.blogs.push(newBlog);
        return true;
    },
    getBlogById(id) {
        return db_1.db.blogs.find((blog) => blog.id === id);
    },
    updateBlog(id, body) {
        const existBlog = this.getBlogById(id);
        if (existBlog) {
            Object.assign(existBlog, body);
            return true;
        }
        else {
            return false;
        }
    },
    removeBlogById(id) {
        const existBlog = this.getBlogById(id);
        if (!existBlog) {
            return false;
        }
        db_1.db.blogs = db_1.db.blogs.filter((blog) => blog.id !== id);
        return true;
    },
};
