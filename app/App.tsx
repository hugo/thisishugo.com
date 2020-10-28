import React from 'react'
import {Meta, Scripts, Styles, Routes} from '@remix-run/react'

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Styles />
        <link rel="stylesheet" href="/css/index.css" />

        <title>Hugo Jobling</title>

        <meta
          content="Hugo Jobling. A programmer, writer, and human"
          name="description"
        />

        <meta
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          name="viewport"
        />

        {/* Facebook */}
        <meta content="Hugo Jobling" property="og:title" />
        <meta content="Hugo Jobling" property="og:site_name" />
        <meta content="https://thisishugo.com" property="og:url" />
        <meta
          content="Hugo Jobling. A programmer, writer, and human"
          property="og:description"
        />
        <meta content="profile" property="og:type" />
        <meta content="/images/hugo_large.jpg" property="og:image" />

        {/* Twitter */}
        <meta content="summary" name="twitter:card" />
        <meta content="@dissimile" name="twitter:site" />
        <meta content="Hugo Jobling" name="twitter:title" />
        <meta
          content="Programmer, writer, and human"
          name="twitter:description"
        />
        <meta content="/images/hugo_large.jpg" name="twitter:image" />

        <link href="/icons/favicon.ico" rel="shortcut icon" />
        <link href="/icons/apple-touch-icon.png" rel="apple-touch-icon" />
      </head>
      <body>
        <Routes />
        <Scripts />
      </body>
    </html>
  )
}
