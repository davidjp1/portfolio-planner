module.exports = {
  'ignorePatterns': ['/lib/**'],
  'env': {
    'node': true,
    'browser': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 13,
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    '@typescript-eslint/ban-ts-comment': 'off'
  }
};
