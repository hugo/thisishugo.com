import {preloadPhotoLink} from '../client/photo.ts'
import {ORIGIN, TITLE} from '../client/site.ts'

// NOTE: The font paths and theme colour mirror `styles.css`; `consistency.test.ts` keeps them in step.

const DESCRIPTION = 'Hugo Jobling is a programmer, writer, and human.'

const fontPreloads = `<link rel="preload" href="/fonts/SourceSans3VF-Upright.otf.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/SourceCodeVF-Upright.otf.woff2" as="font" type="font/woff2" crossorigin>`

// NOTE: Open Graph ends a structured group at the next root tag, so the `og:image:*` tags must follow `og:image` directly.
// NOTE: X falls back from `twitter:*` to `og:*`, so only `twitter:card` and `twitter:site` are set.
// NOTE: `og:site_name` would repeat `og:title`, and `og:locale` would name a territory `lang="en"` does not.
export const headMarkup = `${fontPreloads}
${preloadPhotoLink}
<link rel="icon" href="/icons/favicon.ico" sizes="48x48">
<link rel="icon" href="/icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta name="theme-color" content="#F2BDCD">
<meta name="description" content="${DESCRIPTION}">
<meta property="og:type" content="website">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${DESCRIPTION}">
<meta property="og:image" content="${ORIGIN}/images/social.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Hugo at Yosemite National Park">
<meta property="og:image:type" content="image/jpeg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@dissimile">`
