"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basePostValidator = void 0;
const express_validator_1 = require("express-validator");
exports.basePostValidator = [
    (0, express_validator_1.body)('title').isString().withMessage('Title must be a string').trim().isLength({ min: 2, max: 500 }).withMessage('Title length must be between 2 and 500'),
    (0, express_validator_1.body)('shortDescription').isString().withMessage('ShortDescription must be a string').trim().isLength({ min: 2, max: 100 }).withMessage('ShortDescription length must be between 2 and 100'),
    (0, express_validator_1.body)('content').isString().withMessage('Content must be a string').trim().isLength({ min: 2, max: 1000 }).withMessage('Content length must be between 2 and 1000'),
    (0, express_validator_1.body)('blogId').isString().withMessage('BlogId must be a string').trim().isLength({ min: 1 }).withMessage('BlogId length must be min 1 symbol'),
];
