/** @type {import('lint-staged').Config} */
module.exports = {
  '*.{ts,tsx}': [
    'npx --prefix frontend eslint --config frontend/eslint.config.js --fix',
    'npx --prefix frontend prettier --write',
  ],
  '*.{css,json,md}': ['npx --prefix frontend prettier --write'],
}
