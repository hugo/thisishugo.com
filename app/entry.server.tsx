import ReactDOMServer from 'react-dom/server'
import {RemixServer as Remix, EntryContext, redirect} from 'remix'

let csp =
  process.env.NODE_ENV === 'production'
    ? [
        "default-src 'none'",
        "script-src 'self' 'unsafe-inline' https:",
        "script-src-elem 'self' 'unsafe-inline' https:",
        "style-src 'self'",
        "style-src-elem 'self'",
        "img-src 'self' data:",
        "require-trusted-types-for 'script'",
      ].join('; ')
    : [
        "default-src 'none'",
        "script-src 'unsafe-inline' http://localhost:3000",
        "script-src-elem 'unsafe-inline' http://localhost:3000",
        "style-src 'self'",
        "style-src-elem 'self' http://localhost:3000",
        "img-src 'self' data:",
        'connect-src ws://localhost:3001',
        "require-trusted-types-for 'script'",
      ].join('; ')

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let proto = request.headers.get('X-Forwarded-Proto')

  if (process.env.NODE_ENV === 'production' && proto !== 'https') {
    let url = new URL(request.url)
    url.protocol = 'https'
    return redirect(url.toString(), {
      status: 307,
      headers: {
        'X-Powered-By': 'gremlins',
      },
    })
  }

  let markup = ReactDOMServer.renderToString(
    <Remix context={remixContext} url={request.url} />
  )

  let headers = new Headers(responseHeaders)
  headers.set('Content-Type', 'text/html')
  headers.set('X-Powered-By', 'gremlins')
  headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  headers.set('Content-Security-Policy', csp)

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers,
  })
}
