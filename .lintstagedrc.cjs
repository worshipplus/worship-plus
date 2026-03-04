/** @type {import('lint-staged').Config} */

const path = require('path')

const quote = (filePath) => JSON.stringify(filePath)

const toFrontendRelative = (files) =>
  files
    .map((file) => {
      const repoRelative = path
        .relative(process.cwd(), file)
        .split(path.sep)
        .join('/')
      return repoRelative.replace(/^frontend\//, '')
    })
    .filter(Boolean)

module.exports = {
  'frontend/**/*.{ts,tsx}': (files) => {
    const relFiles = toFrontendRelative(files).map(quote).join(' ')
    return [
      `npm --prefix frontend run -s lint:staged -- ${relFiles}`,
      `npm --prefix frontend run -s format:staged -- ${relFiles}`,
    ]
  },
  'frontend/**/*.{css,json,md}': (files) => {
    const relFiles = toFrontendRelative(files).map(quote).join(' ')
    return [`npm --prefix frontend run -s format:staged -- ${relFiles}`]
  },
}
