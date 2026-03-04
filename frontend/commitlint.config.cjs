/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'us-reference': ({ header, type }) => {
          if (!type || !['feat', 'fix'].includes(type)) return [true]
          const hasUsTag = /\[US-\d{3}\]/.test(header || '')
          return [
            hasUsTag,
            'Commits do tipo feat/fix devem incluir a referência [US-XXX] no header.',
          ]
        },
      },
    },
  ],
  rules: {
    'us-reference': [2, 'always'],
  },
}
