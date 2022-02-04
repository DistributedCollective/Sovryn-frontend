const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  extends: [
    'react-app',
    // react and @typescript-react are now merged into prettier
    'prettier',
  ],
  plugins: ['prettier', 'deprecate'],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    '@typescript-eslint/ban-ts-comment': 'error',
    'deprecate/import': ['warn', { nameRegExp: '@blueprintjs' }],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: { 'prettier/prettier': ['warn', prettierOptions] },
    },
    {
      files: ['**/*.stories.*'],
      rules: {
        'import/no-anonymous-default-export': 'off',
      },
    },
  ],
};
