module.exports = {
  overrides: [
    {
      files: ['**/*.test.*'],
      env: {
        jest: true,
      },
    },
  ],
  ignorePatterns: ['/lib/**'],
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
