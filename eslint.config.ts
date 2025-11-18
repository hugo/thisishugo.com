import eslint from '@eslint/js'
import {defineConfig} from 'eslint/config'
import tseslint from 'typescript-eslint'
import pluginImport from 'eslint-plugin-import'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginJest from 'eslint-plugin-jest'

export default defineConfig(
  {
    ignores: [
      // ESLint will play merry havock if you try and lint its own config file
      'eslint.config.ts',

      'node_modules/',
      'build/',
      'public/build/',
      '.cache/',
    ],
  },
  eslint.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
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
    extends: [pluginJest.configs['flat/recommended']],
  }
)
