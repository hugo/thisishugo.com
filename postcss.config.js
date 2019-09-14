const purgecss =
  // process.env.NODE_ENV === 'production'
  true
    ? {
        '@fullhuman/postcss-purgecss': {
          content: ['./**/*.tsx'],
          whitelist: ['html', 'body', '__next'],
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        },
      }
    : {}

module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'postcss-nested': {},
    ...purgecss,
  },
}
