import {
  Array,
  Context,
  Effect,
  Layer,
  Option,
  Record,
  Schema,
  pipe,
} from 'effect'
import {
  Headers,
  HttpEffect,
  HttpMiddleware,
  HttpServerRequest,
  HttpServerResponse,
} from 'effect/http'

import {ORIGIN} from '../client/site.ts'

const WWW_HOST = `www.${new URL(ORIGIN).hostname}`

const directives = {
  'default-src': ["'none'"],
  'script-src': ["'self'"],
  'style-src': ["'self'"],
  'style-src-attr': ["'unsafe-inline'"],
  'img-src': ["'self'"],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'base-uri': ["'self'"],
  'form-action': ["'none'"],
  'frame-ancestors': ["'none'"],
}

const policyOf = (sources: Record<string, ReadonlyArray<string>>) =>
  pipe(
    Record.toEntries(sources),
    Array.map(([directive, values]) =>
      pipe([directive, ...values], Array.join(' '))
    ),
    Array.join('; ')
  )

const productionHeaders = {
  'content-security-policy': policyOf(directives),
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'x-powered-by': 'gremlins',
  'x-clacks-overhead': 'GNU Terry Pratchett',
}

// NOTE: Development differs only where localhost cannot work: HSTS is ignored over http, and Vite injects stylesheets as <style> elements and hot-reloads over a websocket.
const developmentHeaders = Record.remove(
  {
    ...productionHeaders,
    'content-security-policy': policyOf({
      ...Record.remove(directives, 'style-src'),
      'style-src-elem': ["'self'", "'unsafe-inline'"],
      'connect-src': ["'self'", 'ws:'],
    }),
  },
  'strict-transport-security'
)

// NOTE: The production headers are graded A+ by securityheaders.com and Mozilla Observatory; `scripts/observatory.ts` reports the latter after each deploy.
export class SecurityPolicy extends Context.Service<
  SecurityPolicy,
  {readonly headers: Readonly<Record<string, string>>}
>()('thisishugo/SecurityPolicy') {
  static readonly production = Layer.succeed(
    SecurityPolicy,
    SecurityPolicy.of({headers: productionHeaders})
  )
  static readonly development = Layer.succeed(
    SecurityPolicy,
    SecurityPolicy.of({headers: developmentHeaders})
  )
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

export const policy = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const {headers} = yield* SecurityPolicy
    const request = yield* HttpServerRequest.HttpServerRequest
    const withSecurityHeaders = HttpServerResponse.setHeaders(headers)
    return yield* HostRoute.match(routeHost(request.headers), {
      Canonical: () =>
        HttpEffect.appendPreResponseHandler((_, response) =>
          Effect.succeed(withSecurityHeaders(response))
        ).pipe(Effect.andThen(app)),
      Www: () => Effect.succeed(withSecurityHeaders(apexRedirect(request.url))),
    })
  })
)
