"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminGuardMiddleware = exports.ADMIN_PASSWORD = exports.ADMIN_USERNAME = void 0;
const http_status_1 = require("../enums/http-status");
exports.ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
exports.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';
const superAdminGuardMiddleware = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        res.sendStatus(http_status_1.HTTP_STATUS.UNAUTHORIZED_401);
        return;
    }
    const [authType, token] = auth.split(' ');
    if (authType !== 'Basic') {
        res.sendStatus(http_status_1.HTTP_STATUS.UNAUTHORIZED_401);
    }
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [user, password] = credentials.split(':');
    if (user !== exports.ADMIN_USERNAME || password !== exports.ADMIN_PASSWORD) {
        res.sendStatus(http_status_1.HTTP_STATUS.UNAUTHORIZED_401);
        return;
    }
    next();
};
exports.superAdminGuardMiddleware = superAdminGuardMiddleware;
