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
exports.postsRepository = void 0;
const blogs_repository_1 = require("./blogs.repository");
const mongodb_1 = require("mongodb");
const mango_db_1 = require("../db/mango.db");
exports.postsRepository = {
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return mango_db_1.postCollection.find().toArray();
        });
    },
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const existBlog = yield blogs_repository_1.blogsRepository.getBlogById(body.blogId);
            if (!existBlog) {
                throw new Error('Post not existing');
            }
            const result = yield mango_db_1.postCollection.insertOne(Object.assign(Object.assign({}, body), { blogName: existBlog.name, createdAt: new Date() }));
            return Object.assign(Object.assign({ _id: result.insertedId }, body), { blogName: existBlog.name });
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mango_db_1.postCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const existBlog = yield blogs_repository_1.blogsRepository.getBlogById(body.blogId);
            if (!existBlog) {
                throw new Error('Blog not existing');
            }
            const result = yield mango_db_1.postCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: Object.assign(Object.assign({}, body), { blogName: existBlog.name }) });
            return result.matchedCount === 1;
        });
    },
    removePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mango_db_1.postCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    },
};
