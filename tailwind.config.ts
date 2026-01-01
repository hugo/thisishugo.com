// fuck off
import type {Config} from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx,jsx,html}', './public/**/*.html'],
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
