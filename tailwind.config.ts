// fuck off
// @ts-expect-error workaround for module resolution issues
import type {Config} from 'tailwindcss'

export default {
  content: ['./app/**/*.ts', './app/**/*.tsx'],
  plugins: [],
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
} satisfies Config
