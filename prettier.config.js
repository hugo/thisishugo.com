/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
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
      files: '*.css',
      options: {tailwindStylesheet: './app/styles/index.css'},
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
