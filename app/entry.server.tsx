import {PassThrough} from 'stream'

import {renderToPipeableStream} from 'react-dom/server'
import {RemixServer} from '@remix-run/react'
import {createReadableStreamFromReadable, redirect} from '@remix-run/node'
import type {EntryContext} from '@remix-run/node'

let csp =
  process.env.NODE_ENV === 'production'
    ? [
        "default-src 'none'",
        "script-src 'self' 'unsafe-inline' https:",
        "script-src-elem 'self' 'unsafe-inline' https:",
        "style-src 'self'",
        "style-src-elem 'self'",
        "img-src 'self' data:",
        // "require-trusted-types-for 'script'",
        'connect-src http://localhost:3000/api/events',
      ].join('; ')
    : [
        "default-src 'none'",
        "script-src 'unsafe-inline' http://localhost:3000",
        "script-src-elem 'unsafe-inline' http://localhost:3000",
        "style-src 'self'",
        "style-src-elem 'self' http://localhost:3000",
        "img-src 'self' data:",
        'connect-src ws://localhost:8002 http://localhost:3000/api/events',
        // "require-trusted-types-for 'script'",
      ].join('; ')

const ABORT_DELAY = 5000

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let proto = request.headers.get('X-Forwarded-Proto')
  let url = new URL(request.url)

  if (process.env.NODE_ENV === 'production' && proto !== 'https') {
    url.protocol = 'https'
    return redirect(url.toString(), {
      status: 307,
      headers: {
        'X-Powered-By': 'gremlins',
      },
    })
  }

  if (
    process.env.NODE_ENV === 'production' &&
    url.hostname === 'www.thisishugo.com'
  ) {
    url.hostname = 'thisishugo.com'
    return redirect(url.toString(), {
      status: 307,
      headers: {
        'X-Powered-By': 'gremlins',
      },
    })
  }

  let headers = new Headers(responseHeaders)
  headers.set('Content-Type', 'text/html')
  headers.set('X-Powered-By', 'gremlins')
  headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  headers.set('Content-Security-Policy', csp)

  return new Promise((resolve, reject) => {
    let didError = false

    const {pipe, abort} = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady() {
          let body = new PassThrough()

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              status: didError ? 500 : responseStatusCode,
              headers,
            })
          )
          pipe(body)
        },
        onShellError(err: unknown) {
          reject(err)
        },
        onError(error: unknown) {
          didError = true
          console.error(error)
        },
      }
    )
    setTimeout(abort, ABORT_DELAY)
  })
}
