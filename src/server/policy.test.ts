import {assert, it} from '@effect/vitest'
import {Deferred, Effect, Layer, Option, Record} from 'effect'
import {
  Headers,
  HttpEffect,
  HttpServerRequest,
  HttpServerResponse,
} from 'effect/http'

import {SecurityPolicy, policy} from './policy.ts'

const respond = Effect.fn(function* (
  app: Effect.Effect<HttpServerResponse.HttpServerResponse, unknown>,
  host: string,
  url: string,
  security: Layer.Layer<SecurityPolicy> = SecurityPolicy.production
) {
  const sent = yield* Deferred.make<HttpServerResponse.HttpServerResponse>()
  yield* HttpEffect.toHandled(
    app,
    (_, response) => Deferred.succeed(sent, response),
    policy
  ).pipe(
    Effect.provide(security),
    Effect.provideService(
      HttpServerRequest.HttpServerRequest,
      HttpServerRequest.fromWeb(new Request(`https://${host}${url}`)).modify({
        url,
        headers: Headers.fromInput({host}),
      })
    )
  )
  return yield* Deferred.await(sent)
})

const page = Effect.succeed(HttpServerResponse.text('page'))

const headersOf = (security: Layer.Layer<SecurityPolicy>) =>
  SecurityPolicy.use(({headers}) => Effect.succeed(headers)).pipe(
    Effect.provide(security)
  )

it.effect('the apex is served with the security headers', () =>
  Effect.gen(function* () {
    const response = yield* respond(page, 'thisishugo.com', '/')
    assert.strictEqual(response.status, 200)
    assert.deepInclude(
      response.headers,
      yield* headersOf(SecurityPolicy.production)
    )
  })
)

it.effect('a failing request still carries the security headers', () =>
  Effect.gen(function* () {
    const response = yield* respond(Effect.die('broken'), 'thisishugo.com', '/')
    assert.strictEqual(response.status, 500)
    assert.deepInclude(
      response.headers,
      yield* headersOf(SecurityPolicy.production)
    )
  })
)

it.effect('the www host redirects to the apex, keeping path and query', () =>
  Effect.gen(function* () {
    const response = yield* respond(page, 'www.thisishugo.com', '/x?y=1')
    assert.strictEqual(response.status, 301)
    assert.deepStrictEqual(
      Headers.get(response.headers, 'location'),
      Option.some('https://thisishugo.com/x?y=1')
    )
    assert.deepInclude(
      response.headers,
      yield* headersOf(SecurityPolicy.production)
    )
  })
)

it.effect('development sends the production headers except HSTS', () =>
  Effect.gen(function* () {
    const production = yield* headersOf(SecurityPolicy.production)
    const development = yield* headersOf(SecurityPolicy.development)
    assert.sameMembers(
      Record.keys(development),
      Record.keys(Record.remove(production, 'strict-transport-security'))
    )
  })
)

it.effect(
  'both environments allow style attributes but not inline scripts',
  () =>
    Effect.forEach(
      [SecurityPolicy.production, SecurityPolicy.development],
      (security) =>
        Effect.gen(function* () {
          const headers = yield* headersOf(security)
          const csp = yield* Effect.fromOption(
            Record.get(headers, 'content-security-policy')
          )
          assert.include(csp, "style-src-attr 'unsafe-inline'")
          assert.include(csp, "script-src 'self';")
        })
    )
)
