module.exports = {
  printWidth: 80,
  overrides: [
    {
      files: '*.js',
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
  ],
}
