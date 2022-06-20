module.exports = {
  overrides: [
    {
      files: ['**/*.test.*'],
      env: {
        jest: true,
        node: true,
        es2021: true,
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
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
