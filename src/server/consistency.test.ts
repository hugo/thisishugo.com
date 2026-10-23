import {NodeServices} from '@effect/platform-node'
import {assert, layer} from '@effect/vitest'
import {Array, Effect, Option} from 'effect'
import * as FileSystem from 'effect/FileSystem'

import {preloadPhotoLink} from '../client/photo.ts'
import {headMarkup} from './metadata.ts'

// NOTE: These values live in more than one file and nothing else ties them together.

const styles = FileSystem.FileSystem.use((fs) =>
  fs.readFileString('src/client/styles.css')
)

const cssToken = (css: string, name: string) =>
  new RegExp(`--${name}:\\s*([^;]+);`, 'u').exec(css)?.[1]?.trim()

const remToPx = (rem: string | undefined) =>
  Number.parseFloat(rem ?? 'NaN') * 16

layer(NodeServices.layer)((it) => {
  it.effect('the photo breakpoints match the layout breakpoints', () =>
    Effect.gen(function* () {
      const css = yield* styles
      const medium = remToPx(cssToken(css, 'breakpoint-md'))
      const wide = remToPx(cssToken(css, 'breakpoint-xl'))
      assert.include(preloadPhotoLink, `media="(min-width: ${medium}px)"`)
      assert.include(preloadPhotoLink, `(min-width: ${wide}px)`)
    })
  )

  it.effect('every preloaded font is a declared font face', () =>
    Effect.gen(function* () {
      const css = yield* styles
      const preloads = Array.getSomes(
        Array.map(
          Array.fromIterable(
            headMarkup.matchAll(
              /<link rel="preload" href="([^"]+)" as="font"/gu
            )
          ),
          ([, href]) => Option.fromNullishOr(href)
        )
      )
      assert.isNotEmpty(preloads)
      assert.deepStrictEqual(
        Array.filter(preloads, (href) => !css.includes(`url("${href}")`)),
        []
      )
    })
  )

  it.effect('the theme colour is the accent colour', () =>
    Effect.gen(function* () {
      const css = yield* styles
      const accent = cssToken(css, 'color-accent')?.toLowerCase()
      assert.include(
        headMarkup.toLowerCase(),
        `<meta name="theme-color" content="${accent}">`
      )
    })
  )
})
