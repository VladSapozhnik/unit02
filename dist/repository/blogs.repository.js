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
const mango_db_1 = require("../db/mango.db");
const mongodb_1 = require("mongodb");
exports.blogsRepository = {
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return mango_db_1.blogCollection.find().toArray();
        });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = Object.assign(Object.assign({}, body), { createdAt: new Date(), isMembership: false });
            const result = yield mango_db_1.blogCollection.insertOne(newBlog);
            return Object.assign(Object.assign({}, newBlog), { _id: result.insertedId });
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return mango_db_1.blogCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mango_db_1.blogCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: body });
            return result.matchedCount === 1;
        });
    },
    removeBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mango_db_1.blogCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    },
};
