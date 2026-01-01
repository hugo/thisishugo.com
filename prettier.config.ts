import type {Config} from 'prettier'
import type {PluginOptions as TailwindPluginOptions} from 'prettier-plugin-tailwindcss'

export default {
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 80,
  tailwindStylesheet: './app/styles/index.css',
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
} satisfies Config & TailwindPluginOptions
