/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  'collectCoverageFrom': [
    'src/**/*.tsx','src/**/*.ts','src/**/*.jsx','src/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  globals: {},
  // A map from regular expressions to paths to transformers
  transform: {'^.+\\.[tj]sx?$': 'esbuild-jest'},
  setupFilesAfterEnv: ['./jest.setup.js'],
};
