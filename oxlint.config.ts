import {defineConfig} from 'oxlint'

export default defineConfig({
  plugins: ['eslint', 'typescript', 'oxc', 'import', 'react', 'vitest'],
  categories: {
    correctness: 'error',
    suspicious: 'error',
    pedantic: 'error',
    nursery: 'error',
  },
  options: {
    typeAware: true,
  },
  env: {
    // Language floor for all files; per-runtime envs are scoped in overrides.
    es2025: true,
  },
  rules: {
    // tsc (noUnusedLocals/noUnusedParameters) and type-aware rules handle these.
    'eslint/no-unused-vars': 'off',
    'eslint/prefer-const': 'off',

    // Not enabled by any default category, so opt in.
    'eslint/no-undef': 'error',

    'import/no-unassigned-import': 'off',
    'typescript/consistent-return': 'off',
    'typescript/strict-boolean-expressions': 'off',
    // False positives on React callback props.
    'typescript/prefer-readonly-parameter-types': 'off',

    'react/react-in-jsx-scope': 'off',

    'typescript/prefer-promise-reject-errors': [
      'error',
      {allowThrowingUnknown: true},
    ],

    'typescript/consistent-type-imports': [
      'error',
      {fixStyle: 'separate-type-imports', prefer: 'type-imports'},
    ],
  },
  overrides: [
    {
      // Universal route/root modules: render on the server, hydrate in the browser,
      // so browser globals must cover them. `process` is the lone Node global that's
      // safe (Vite statically replaces process.env on the client; it's real on the
      // server), so it's the only Node global declared here.
      files: ['app/**/*.{ts,tsx}'],
      env: {
        browser: true,
      },
      globals: {
        process: 'readonly',
      },
    },
    {
      // Node-only files: build/tooling config and the vitest test suite runner.
      files: [
        'vite.config.ts',
        'oxlint.config.ts',
        'oxfmt.config.ts',
        'tests/**/*.{ts,tsx}',
      ],
      env: {
        node: true,
      },
    },
    {
      // Tests run in vitest (Node) against a jsdom DOM, so both envs apply.
      files: ['**/*.test.{ts,tsx}'],
      env: {
        browser: true,
        node: true,
      },
      rules: {
        'typescript/no-unsafe-call': 'off',
        'typescript/no-unsafe-member-access': 'off',
      },
    },
  ],
})
