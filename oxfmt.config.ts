import {defineConfig} from 'oxfmt'

export default defineConfig({
  printWidth: 80,
  sortImports: {
    groups: [
      ['type-builtin', 'value-builtin'],
      ['type-external', 'value-external'],
      [
        'type-index',
        'type-parent',
        'type-sibling',
        'value-index',
        'value-parent',
        'value-sibling',
      ],
      ['type-internal', 'value-internal'],
      'unknown',
    ],
  },
  sortTailwindcss: {
    stylesheet: './app/styles/index.css',
  },
  overrides: [
    {
      // Scoped to JS/TS; YAML, CSS, JSON, TOML etc. keep oxfmt defaults.
      files: ['*.js', '*.cjs', '*.mjs', '*.ts', '*.tsx'],
      options: {
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: false,
      },
    },
    {
      files: ['*.md'],
      options: {
        proseWrap: 'always',
      },
    },
    {
      files: ['*.html'],
      options: {
        printWidth: 120,
      },
    },
  ],
})
