/* eslint-env node */

const purgecss =
  process.env.NODE_ENV === 'production'
    ? {
        '@fullhuman/postcss-purgecss': {
          content: ['./**/*.tsx'],
          safelist: ['html', 'body', '__next'],
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
