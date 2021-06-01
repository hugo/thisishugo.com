import ReactDOMServer from 'react-dom/server'
import {RemixServer as Remix, EntryContext, redirect} from 'remix'

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
    return redirect(url.toString(), 307)
  }

  let markup = ReactDOMServer.renderToString(
    <Remix context={remixContext} url={request.url} />
  )

  let headers = new Headers(responseHeaders)
  headers.set('Content-Type', 'text/html')
  headers.set('X-Powered-By', 'gremlins')

  if (proto === 'https') {
    headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    )
  }

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers,
  })
}
