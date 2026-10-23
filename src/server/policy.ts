import {Effect, Option, Schema} from 'effect'
import {
  Headers,
  HttpEffect,
  HttpMiddleware,
  HttpServerRequest,
  HttpServerResponse,
} from 'effect/http'

import {ORIGIN} from '../client/site.ts'

const WWW_HOST = `www.${new URL(ORIGIN).hostname}`

// NOTE: These headers are graded A+ by securityheaders.com and Mozilla Observatory; `scripts/observatory.ts` reports the latter after each deploy.
export const securityHeaders = {
  'content-security-policy': [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join('; '),
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'x-powered-by': 'gremlins',
  'x-clacks-overhead': 'GNU Terry Pratchett',
}

const HostRoute = Schema.TaggedUnion({Canonical: {}, Www: {}})
type HostRoute = typeof HostRoute.Type

const routeHost = (headers: Headers.Headers): HostRoute =>
  Headers.get(headers, 'host').pipe(
    Option.flatMapNullishOr((host) => URL.parse(`http://${host}`)),
    Option.filter(({hostname}) => hostname === WWW_HOST),
    Option.match({
      onNone: () => HostRoute.cases.Canonical.make({}),
      onSome: () => HostRoute.cases.Www.make({}),
    })
  )

const apexRedirect = (requestUrl: string) =>
  HttpServerResponse.redirect(
    Option.fromNullishOr(URL.parse(requestUrl, ORIGIN)).pipe(
      Option.match({
        onNone: () => ORIGIN,
        onSome: ({pathname, search}) => `${ORIGIN}${pathname}${search}`,
      })
    ),
    {status: 301}
  )

const withSecurityHeaders = HttpServerResponse.setHeaders(securityHeaders)

export const policy = HttpMiddleware.make((app) =>
  HttpServerRequest.HttpServerRequest.use((request) =>
    HostRoute.match(routeHost(request.headers), {
      Canonical: () =>
        HttpEffect.appendPreResponseHandler((_, response) =>
          Effect.succeed(withSecurityHeaders(response))
        ).pipe(Effect.andThen(app)),
      Www: () => Effect.succeed(withSecurityHeaders(apexRedirect(request.url))),
    })
  )
)
