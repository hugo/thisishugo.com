import eslint from '@eslint/js'
import {defineConfig} from 'eslint/config'
import tseslint from 'typescript-eslint'
import pluginImport from 'eslint-plugin-import'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginVitest from 'eslint-plugin-vitest'

export default defineConfig(
  {
    ignores: [
      // ESLint will play merry havock if you try and lint its own config file
      'eslint.config.ts',

      'node_modules/',
      'build/',
      'public/build/',
      '.cache/',
      '.react-router/',
    ],
  },
  eslint.configs.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.strictTypeChecked,
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
    extends: [tseslint.configs.disableTypeChecked],
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
