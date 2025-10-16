import html from 'eslint-plugin-html'
module.exports = {
  plugins: [html],
  extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
  rules: {
    'no-unused-vars': 'warn',
    '@next/next/no-unused-vars': 'off',
    'prettier/prettier': 'error',
  },
}
