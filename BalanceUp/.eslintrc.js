module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'react/react-in-jsx-scope': 'off',
    'spaced-comment': 'error',
    'no-duplicate-imports': 'warn',
    'react-hooks/rules-of-hooks': 'warn', // Checks rules of Hooks
    'react-native/no-inline-styles': 0,
    'react-hooks/exhaustive-deps': 'off',
    'no-shadow': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
  parser: 'babel-eslint',
};
