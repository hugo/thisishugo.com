import type {Config} from 'prettier'
import type {PluginOptions as TailwindPluginOptions} from 'prettier-plugin-tailwindcss'
import type {prettierOptionsDefinitions} from 'prettier-plugin-toml'

// Derive the options config from the available options.
// Why this isn't already there beats me.
type TomlPrettierOptionsDefinitions = typeof prettierOptionsDefinitions
export type TomlPluginOptions = {
  [K in keyof TomlPrettierOptionsDefinitions]?: TomlPrettierOptionsDefinitions[K]['type'] extends 'boolean'
    ? boolean
    : TomlPrettierOptionsDefinitions[K]['type'] extends 'int'
      ? number
      : unknown
}

export default {
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-toml'],
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
      files: '*.toml',
      options: {
        alignEntries: false,
        compactArrays: true,
        indentEntries: true,
        indentTables: true,
      } satisfies TomlPluginOptions,
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
