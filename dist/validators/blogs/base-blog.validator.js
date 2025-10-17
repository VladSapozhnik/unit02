"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseBlogValidator = void 0;
// import {body} from "express-validator";
const express_validator_1 = require("express-validator");
exports.baseBlogValidator = [
    (0, express_validator_1.body)('name')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .isLength({ min: 2, max: 15 })
        .withMessage('Name length must be between 2 and 15'),
    (0, express_validator_1.body)('description')
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .isLength({ min: 2, max: 500 })
        .withMessage('Description length must be between 2 and 500'),
    (0, express_validator_1.body)('websiteUrl')
        .isString()
        .withMessage('WebsiteUrl must be a string')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('websiteUrl length must be between 2 and 100')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('WebsiteUrl must be a valid URL starting with https://'),
];
