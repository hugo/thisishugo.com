import type {LinksFunction, MetaFunction} from '@remix-run/node'
import {Links, LiveReload, Meta, Outlet, Scripts} from '@remix-run/react'

import styles from './styles/index.css'

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

        <Scripts />
      </body>
    </html>
  )
}
