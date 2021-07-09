module.exports = {
  purge: ['./app/**/*.ts', './app/**/*.tsx'],
  plugins: [],
  mode: 'jit',
  darkMode: false,
  theme: {
    extend: {
      colors: {
        // brands
        twitter: '#1da1f2',
        medium: '#02b875',
      },
      screens: {
        portrait: {raw: '(orientation: portrait)'},
        landscape: {raw: '(orientation: landscape)'},
      },
    },
  },
  variants: {},
}
