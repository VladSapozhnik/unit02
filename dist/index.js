"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const setup_app_1 = require("./setup-app");
const express_1 = __importDefault(require("express"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
(0, setup_app_1.setupApp)(app);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
