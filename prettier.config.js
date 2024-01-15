/** @type {import('prettier').Config} */
export default {
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 80,
  overrides: [
    {
      files: ['*.js', '*.cjs', '*.mjs', '*.ts', '*.tsx'],
      options: {
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: false,
        arrowParens: 'always',
      },
    },
    {
      files: '*.html',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
      },
    },
  ],
}
