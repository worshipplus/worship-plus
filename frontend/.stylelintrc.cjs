/** @type {import('stylelint').Config} */
module.exports = {
  rules: {
    // Garante que @import esteja no topo, antes de outras diretivas
    'no-invalid-position-at-import-rule': true,
    // Permite diretivas customizadas do Tailwind CSS
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'responsive', 'variants', 'screen'],
      },
    ],
  },
}
