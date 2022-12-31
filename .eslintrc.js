module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true,
    jquery: true,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: 'next',
      },
    ],
    'eol-last': ['error', 'always'],
    'class-methods-use-this': 0,
    'func-names': 0,
  },
};
