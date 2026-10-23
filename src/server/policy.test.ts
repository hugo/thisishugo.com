import {assert, it} from '@effect/vitest'
import {Deferred, Effect, Option} from 'effect'
import {
  Headers,
  HttpEffect,
  HttpServerRequest,
  HttpServerResponse,
} from 'effect/http'

import {policy, securityHeaders} from './policy.ts'

const respond = Effect.fn(function* (
  app: Effect.Effect<HttpServerResponse.HttpServerResponse, unknown>,
  host: string,
  url: string
) {
  const sent = yield* Deferred.make<HttpServerResponse.HttpServerResponse>()
  yield* HttpEffect.toHandled(
    app,
    (_, response) => Deferred.succeed(sent, response),
    policy
  ).pipe(
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

it.effect('the apex is served with the security headers', () =>
  Effect.gen(function* () {
    const response = yield* respond(page, 'thisishugo.com', '/')
    assert.strictEqual(response.status, 200)
    assert.deepInclude(response.headers, securityHeaders)
  })
)

it.effect('a failing request still carries the security headers', () =>
  Effect.gen(function* () {
    const response = yield* respond(Effect.die('broken'), 'thisishugo.com', '/')
    assert.strictEqual(response.status, 500)
    assert.deepInclude(response.headers, securityHeaders)
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
    assert.deepInclude(response.headers, securityHeaders)
  })
)
