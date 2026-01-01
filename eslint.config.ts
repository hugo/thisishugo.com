import {fileURLToPath} from 'node:url'

import eslint from '@eslint/js'
import {defineConfig} from 'eslint/config'
import {
  parser as tslintParser,
  configs as tseslintConfigs,
} from 'typescript-eslint'
import pluginImport from 'eslint-plugin-import'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginVitest from '@vitest/eslint-plugin'
import {includeIgnoreFile} from '@eslint/compat'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig(
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  eslint.configs.recommended,
  {
    languageOptions: {
      parser: tslintParser,
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslintConfigs.strictTypeChecked,
      pluginImport.flatConfigs.recommended,
      pluginImport.flatConfigs.react,
      pluginImport.flatConfigs.typescript,
      pluginReact.configs.flat.recommended,
      pluginReactHooks.configs.flat['recommended-latest'],
    ],
    rules: {
      'no-unused-vars': 'off',
      'prefer-const': 'off',

      'react/react-in-jsx-scope': 'off',

      '@typescript-eslint/prefer-promise-reject-errors': [
        'error',
        {allowThrowingUnknown: true},
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {fixStyle: 'separate-type-imports', prefer: 'type-imports'},
      ],

      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            'builtin',
            'external',
            ['index', 'parent', 'sibling'],
            'internal',
            'object',
          ],
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },

      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts', '.css'],
        },
        typescript: {},
      },
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslintConfigs.disableTypeChecked],
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    extends: [pluginVitest.configs.recommended],
    // Tests: relax strict type-related rules to match typical test ergonomics.
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  }
)
