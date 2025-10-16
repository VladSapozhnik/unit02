'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateId = void 0;
const node_crypto_1 = require('node:crypto');
const generateId = () => node_crypto_1.webcrypto.randomUUID();
exports.generateId = generateId;
