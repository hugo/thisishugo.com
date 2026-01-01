import type {
  LinksFunction,
  MetaFunction,
  HeadersFunction,
  MiddlewareFunction,
} from 'react-router'
import {Links, Meta, Outlet, redirect, Scripts} from 'react-router'

import styles from './styles/index.css?url'

let csp =
  process.env.NODE_ENV === 'production'
    ? [
        "default-src 'none'",
        "script-src 'self' 'unsafe-inline' https:",
        "script-src-elem 'self' 'unsafe-inline' https:",
        "style-src 'self'",
        "style-src-elem 'self'",
        "img-src 'self' data:",
      ].join('; ')
    : [
        "default-src 'none'",
        "script-src 'unsafe-inline' http://localhost:3000",
        "script-src-elem 'unsafe-inline' http://localhost:3000",
        "style-src 'self'",
        "style-src-elem 'self' http://localhost:3000",
        "img-src 'self' data:",
        // Vite WebSocket for HMR
        'connect-src ws://localhost:3000',
      ].join('; ')

export let headers: HeadersFunction = () => {
  const headers = new Headers()
  headers.set('X-Powered-By', 'gremlins')
  headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  headers.set('Content-Security-Policy', csp)

  return headers
}

export let links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {rel: 'shortcut icon', href: '/icons/favicon.ico'},
    {rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png'},
  ]
}

export let meta: MetaFunction = () => [
  {description: 'Hugo Jobling. Trying my best.'},

  {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, viewport-fit=cover',
  },

  {name: 'og:title', content: 'Hugo Jobling'},
  {name: 'og:site_name', content: 'Hugo Jobling'},
  {name: 'og:url', content: 'https://thisishugo.com'},
  {name: 'og:description', content: 'Hugo Jobling. Trying my best'},
  {name: 'og:profile', content: 'profile'},
  {name: 'og:image', content: '/images/hugo_large.jpg'},

  {name: 'twitter:card', content: 'summary'},
  {name: 'twitter:site', content: '@dissimile'},
  {name: 'twitter:title', content: 'Hugo Jobling'},
  {name: 'twitter:description', content: 'Trying my best'},
  {name: 'twitter:image', content: '/images/hugo_large.jpg'},

  {name: 'theme-color', content: 'rgb(75, 106, 136)'},
]

export let middleware: MiddlewareFunction[] = [
  ({request}) => {
    let url = new URL(request.url)
    if (url.host === 'www.thisishugo.com') {
      url.host = 'thisishugo.com'

      return redirect(url.href, {status: 301})
    }
  },
  ({request}) => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    let url = new URL(request.url)
    let isHttps = [
      url.protocol === 'https',
      request.headers.get('X-Forwarded-Proto') === 'https',
    ].some(Boolean)

    if (!isHttps) {
      url.protocol = 'https'

      return redirect(url.href, {status: 301})
    }
  },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Oops!</title>
      </head>
      <body>
        <div>
          <h1>App Error</h1>
          <pre>{error.message}</pre>
          <p>
            Replace this UI with what you want users to see when your app throws
            uncaught errors. The file is at <code>app/root.tsx</code>.
          </p>
        </div>

        <Scripts />
      </body>
    </html>
  )
}
