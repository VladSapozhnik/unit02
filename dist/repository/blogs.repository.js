"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../db");
exports.blogsRepository = {
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.db.blogs.map((blog) => blog);
        });
    },
    createBlog(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = Object.assign({ id }, body);
            db_1.db.blogs.push(newBlog);
            return true;
        });
    },
    getBlogById(id) {
        return db_1.db.blogs.find((blog) => blog.id === id);
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const existBlog = this.getBlogById(id);
            if (existBlog) {
                Object.assign(existBlog, body);
                return true;
            }
            else {
                return false;
            }
        });
    },
    removeBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existBlog = yield this.getBlogById(id);
            if (!existBlog) {
                return false;
            }
            db_1.db.blogs = db_1.db.blogs.filter((blog) => blog.id !== id);
            return true;
        });
    },
};
