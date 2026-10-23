import foldkitPlugin from '@foldkit/oxlint-plugin'
import {defineConfig} from 'oxlint'

export default defineConfig({
  jsPlugins: ['@foldkit/oxlint-plugin'],
  plugins: ['eslint', 'typescript', 'oxc', 'import', 'vitest'],
  categories: {correctness: 'error', suspicious: 'error', pedantic: 'error'},
  options: {typeAware: true, typeCheck: true},
  env: {es2025: true},
  rules: {
    ...foldkitPlugin.configs.recommended.rules,
    // Correctness rules outside the enabled categories.
    'eslint/no-ternary': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/no-non-null-assertion': 'error',
    'typescript/no-unnecessary-condition': 'error',
    // Taste rather than correctness.
    'eslint/max-classes-per-file': 'off',
    'eslint/max-depth': 'off',
    'eslint/max-lines': 'off',
    'eslint/max-lines-per-function': 'off',
    'eslint/max-nested-callbacks': 'off',
    'eslint/no-else-return': 'off',
    'eslint/no-inline-comments': 'off',
    'eslint/no-lonely-if': 'off',
    'eslint/no-negated-condition': 'off',
    'eslint/sort-vars': 'off',
    'import/max-dependencies': 'off',
    'oxc/branches-sharing-code': 'off',
    'typescript/prefer-readonly-parameter-types': 'off',
    // Schema exports a value and a type under one name: `Model`, `Message`.
    'eslint/no-redeclare': 'off',
    // Stylesheets are imported for their side effect.
    'import/no-unassigned-import': ['error', {allow: ['**/*.css']}],
  },
  overrides: [
    ...foldkitPlugin.configs.recommended.overrides,
    {
      files: ['src/client/**/*.ts'],
      env: {browser: true},
      rules: {
        'eslint/no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/server/**', 'node:*'],
                message: 'Client code never imports server or Node modules.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/server/**/*.ts'],
      env: {node: true},
      rules: {
        'eslint/no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  '**/client/**',
                  '!**/client/main.ts',
                  '!**/client/view.ts',
                  '!**/client/route.ts',
                  '!**/client/site.ts',
                  '!**/client/photo.ts',
                ],
                message:
                  'Server code imports only the client init, view, routes, site identity and photo markup.',
              },
            ],
          },
        ],
      },
    },
    {files: ['*.ts', 'scripts/**/*.ts'], env: {node: true}},
  ],
})
