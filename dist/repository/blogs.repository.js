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
        const blog = this.getBlogById(id);
        if (blog) {
            Object.assign(blog, body);
            return true;
        }
        else {
            return false;
        }
    },
    removeBlogById(id) {
        const blog = this.getBlogById(id);
        if (blog) {
            db_1.db.blogs = db_1.db.blogs.filter((blog) => blog.id === id);
            return true;
        }
        else {
            return false;
        }
    }
};
