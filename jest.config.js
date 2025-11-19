const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/

module.exports = {
  // testTimeout: 10000,
  testEnvironment: 'node',
  // testPathIgnorePatterns: [
  //   '.*manager.ts$', // Игнорировать файлы, оканчивающиеся на manager.ts
  //   '.*helper.ts$', // Игнорировать файлы, оканчивающиеся на helper.ts
  // ],
  testMatch: ['**/__tests__/**/*.spec.ts', '**/__tests__/**/*.test.ts'],
  transform: {
    ...tsJestTransformCfg,
  },
};
