"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const http_status_1 = require("../enums/http-status");
const inputValidationMiddleware = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const errors = result
            .formatWith((error) => ({
            message: error.msg,
            field: error.path || error.param,
        }))
            .array({ onlyFirstError: true });
        return res
            .status(http_status_1.HTTP_STATUS.BAD_REQUEST_400)
            .json({ errorsMessages: errors });
    }
    next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
