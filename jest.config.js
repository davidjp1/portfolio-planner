/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const React = require('react');

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.tsx',
    'src/**/*.ts',
    'src/**/*.jsx',
    'src/**/*.js',
  ],
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['functions'],
  coverageProvider: 'v8',
  globals: { React },
  testEnvironment: 'jsdom',
  // A map from regular expressions to paths to transformers
  transform: { '^.+\\.[tj]sx?$': 'esbuild-jest' },
  setupFilesAfterEnv: ['./jest.setup.js'],
};
