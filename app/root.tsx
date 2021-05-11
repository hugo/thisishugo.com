import type {LinksFunction, MetaFunction} from 'remix'
import {Meta, Links, LiveReload} from 'remix'
import {Outlet} from 'react-router-dom'

import styles from './styles/index.css'

export let links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {rel: 'shortcut icon', href: '/icons/favicon.ico'},
    {rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png'},
  ]
}

export let meta: MetaFunction = () => ({
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  description: 'Hugo Jobling. A programmer, writer, and human',

  'og:title': 'Hugo Jobling',
  'og:site_name': 'Hugo Jobling',
  'og:url': 'https://thisishugo.com',
  'og:description': 'Hugo Jobling. A programmer, writer, and human',
  'og:profile': 'profile',
  'og:image': '/images/hugo_large.jpg',

  'twitter:card': 'summary',
  'twitter:site': '@dissimile',
  'twitter:title': 'Hugo Jobling',
  'twitter:description': 'Programmer, writer, and human',
  'twitter:image': '/images/hugo_large.jpg',
})

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
        {/* No need to load these at present so don't take the (minor) perf hit */}
        {/* <Scripts /> */}
        {process.env.NODE_ENV === 'development' && <LiveReload />}
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

        {/* <Scripts /> */}
      </body>
    </html>
  )
}
