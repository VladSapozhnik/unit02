"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const setting_1 = require("./setting");
const PORT = process.env.PORT || 3000;
setting_1.app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
