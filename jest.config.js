const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/


module.exports = {
    testEnvironment: "node",
    testPathIgnorePatterns: [
        ".*manager.ts$", // Игнорировать файлы, оканчивающиеся на manager.ts
        ".*helper.ts$" // Игнорировать файлы, оканчивающиеся на helper.ts
    ],
    transform: {
        ...tsJestTransformCfg,
    },
};