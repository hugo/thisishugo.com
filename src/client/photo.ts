// NOTE: Raw markup is required because Foldkit has no media attribute builder.
// NOTE: The breakpoints mirror `styles.css`; `src/server/consistency.test.ts` keeps them in step.
const STACK_THRESHOLD = '(min-width: 768px)'

const SPLIT_SIZES = '(min-width: 1280px) calc((100vw - 32rem) / 2), 50vw'

const STACKED_SIZES = '100vw'

const SPLIT_SRCSET = [
  '/images/split-640.avif 640w',
  '/images/split-1280.avif 1280w',
  '/images/split-1536.avif 1536w',
  '/images/split-2560.avif 2560w',
].join(', ')

const STACKED_SRCSET = [
  '/images/stacked-640.avif 640w',
  '/images/stacked-1280.avif 1280w',
  '/images/stacked-1536.avif 1536w',
  '/images/stacked-2560.avif 2560w',
].join(', ')

const SPLIT_JPEG_SRCSET = SPLIT_SRCSET.replaceAll('.avif', '.jpg')
const STACKED_JPEG_SRCSET = STACKED_SRCSET.replaceAll('.avif', '.jpg')

export const pictureHtml = `<picture>
  <source media="${STACK_THRESHOLD}" type="image/avif" sizes="${SPLIT_SIZES}" srcset="${SPLIT_SRCSET}">
  <source media="${STACK_THRESHOLD}" type="image/jpeg" sizes="${SPLIT_SIZES}" srcset="${SPLIT_JPEG_SRCSET}">
  <source type="image/avif" sizes="${STACKED_SIZES}" srcset="${STACKED_SRCSET}">
  <img src="/images/fallback.jpg" srcset="${STACKED_JPEG_SRCSET}" sizes="${STACKED_SIZES}" alt="" fetchpriority="high" decoding="sync" class="absolute inset-0 h-full w-full object-cover object-center">
</picture>`

export const preloadPhotoLink = `<link rel="preload" as="image" fetchpriority="high" media="${STACK_THRESHOLD}" imagesrcset="${SPLIT_SRCSET}" imagesizes="${SPLIT_SIZES}">`
