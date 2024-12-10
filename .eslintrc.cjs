/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
      formComponents: ['Form'],
      linkComponents: [
        {name: 'Link', linkAttribute: 'to'},
        {name: 'NavLink', linkAttribute: 'to'},
      ],
      'import/resolver': {
        typescript: {},
      },
    },
  },
  ignorePatterns: ['node_modules/', 'build/', 'public/build/', '.cache/'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    'prefer-const': 'off',

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

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      parser: 'espree',
      files: [
        '.eslintrc.js',
        'jest-platywright.config.js',
        'pm2.config.js',
        'prettier.config.js',
        'postcss.config.js',
        'remix.config.js',
        'tailwind.config.js',
      ],
      env: {node: true},
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['app/entry.client.tsx'],
      env: {
        browser: true,
      },
    },
    {
      files: ['app/entry.server.tsx'],
      env: {
        node: true,
      },
    },
    {
      files: ['app/routes/**', 'app/root.tsx'],
      env: {
        node: true,
        browser: true,
      },
    },
    {
      plugins: ['jest'],
      files: ['*.test.ts', '*.test.tsx', 'jest.config.ts'],
      env: {
        'jest/globals': true,
        node: true,
      },
    },
    {
      files: ['*.tsx'],
      rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
  ],
}
