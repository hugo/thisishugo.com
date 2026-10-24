import {
  IncomingMessage,
  ServerResponse,
  createServer as createHttpServer,
  type Server,
} from 'node:http'

import {NodeHttpServer, NodeHttpServerRequest} from '@effect/platform-node'
import {Context, Effect, Layer, Match, Schema} from 'effect'
import {HttpRouter, HttpServerRequest, HttpServerResponse} from 'effect/http'
import {type ViteDevServer, createServer} from 'vite'

import {Listen} from './listen.ts'

class DevelopmentServerError extends Schema.TaggedError<DevelopmentServerError>()(
  'DevelopmentServerError',
  {cause: Schema.Defect()}
) {}

// NOTE: Effect's HttpServer answers every upgrade request, so a socket shared with Vite gets two handshakes and corrupt frames. HMR gets its own server on a free port, never served by Effect, which also keeps parallel dev servers from colliding.
class Hmr extends Context.Service<Hmr, {port: number; server: Server}>()(
  'thisishugo/Hmr'
) {
  static readonly layer = Layer.effect(
    Hmr,
    Effect.gen(function* () {
      const server = createHttpServer()
      const {address} = yield* NodeHttpServer.make(() => server, {port: 0})
      const withPort = ({port}: {port: number}) =>
        Effect.succeed({port, server})
      return yield* Match.valueTags(address, {
        InetAddressV4: withPort,
        InetAddressV6: withPort,
        UnixPathAddress: () =>
          Effect.fail(new DevelopmentServerError({cause: 'HMR has no port'})),
      })
    })
  )
}

class Vite extends Context.Service<Vite, ViteDevServer>()('thisishugo/Vite') {
  static readonly layer = Layer.effect(
    Vite,
    Effect.acquireRelease(
      Effect.gen(function* () {
        const {port, server} = yield* Hmr
        return yield* Effect.tryPromise({
          try: () =>
            createServer({
              appType: 'custom',
              server: {middlewareMode: true, ws: {server, clientPort: port}},
            }),
          catch: (cause) => new DevelopmentServerError({cause}),
        })
      }),
      (vite) => Effect.promise(() => vite.close())
    )
  )
}

// NOTE: Vite writes to the Node response directly; Effect skips writing a response that has already ended.
const viteResponse = Effect.fn('Vite.respond')(function* (
  vite: ViteDevServer,
  request: HttpServerRequest.HttpServerRequest
) {
  const incoming = NodeHttpServerRequest.toIncomingMessage(request)
  const outgoing = NodeHttpServerRequest.toServerResponse(request)
  if (
    !(incoming instanceof IncomingMessage) ||
    !(outgoing instanceof ServerResponse)
  ) {
    return yield* Effect.die('Vite middleware serves HTTP/1 requests only')
  }
  return yield* Effect.callback<HttpServerResponse.HttpServerResponse>(
    (resume) => {
      const onFinish = () => {
        resume(Effect.succeed(HttpServerResponse.empty()))
      }
      outgoing.once('finish', onFinish)
      vite.middlewares(incoming, outgoing, () => {
        resume(Effect.succeed(HttpServerResponse.empty({status: 404})))
      })
      return Effect.sync(() => {
        outgoing.off('finish', onFinish)
      })
    }
  )
})

const Routes = HttpRouter.use(
  Effect.fn(function* (router) {
    const vite = yield* Vite
    yield* router.add(
      '*',
      '/*',
      HttpServerRequest.HttpServerRequest.use((request) =>
        viteResponse(vite, request)
      )
    )
  })
)

export const DevelopmentServer = HttpRouter.serve(Routes, {
  disableLogger: true,
}).pipe(
  Layer.provide(Vite.layer),
  Layer.provide(Hmr.layer),
  Layer.provide(Listen)
)
