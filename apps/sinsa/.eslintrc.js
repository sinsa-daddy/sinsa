module.exports = {
  root: true,
  extends: ['@modern-js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
  },
};
