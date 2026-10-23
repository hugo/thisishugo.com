import {pathToFileURL} from 'node:url'

import {Config, Context, Effect, Layer, Predicate, Schema} from 'effect'
import type {Scope} from 'effect'
import * as FileSystem from 'effect/FileSystem'
import {
  HttpRouter,
  HttpServerError,
  HttpServerRequest,
  HttpServerResponse,
  HttpStaticServer,
} from 'effect/http'
import * as Path from 'effect/Path'
import {Server} from 'foldkit/experimental'

import {Listen} from './listen.ts'
import {policy} from './policy.ts'

const MANIFEST_PATH = 'dist/server/foldkit.build.json'

class BuildError extends Schema.TaggedError<BuildError>()('BuildError', {
  cause: Schema.Defect(),
}) {
  override get message(): string {
    return `could not load the build in ${MANIFEST_PATH}; run \`npm run build\` first`
  }
}

const Manifest = Schema.Struct({
  client: Schema.String,
  server: Schema.String,
  serverEntry: Schema.String,
})

type Fetch = (request: Request) => Promise<Response>

const FetchModule = Schema.Struct({
  default: Schema.Struct({
    fetch: Schema.declare((u): u is Fetch => Predicate.isFunction(u)),
  }),
})

class BuildManifest extends Context.Service<
  BuildManifest,
  {readonly clientDirectory: string; readonly serverEntry: string}
>()('thisishugo/BuildManifest') {
  static readonly layer = Layer.effect(
    BuildManifest,
    Effect.gen(function* () {
      const fileSystem = yield* FileSystem.FileSystem
      const path = yield* Path.Path
      const manifest = yield* fileSystem.readFileString(MANIFEST_PATH).pipe(
        Effect.flatMap(
          Schema.decodeUnknownEffect(Schema.fromJsonString(Manifest))
        ),
        Effect.mapError((cause) => new BuildError({cause}))
      )
      return BuildManifest.of({
        clientDirectory: path.resolve(manifest.client),
        serverEntry: path.resolve(manifest.server, manifest.serverEntry),
      })
    })
  )
}

// NOTE: The WHATWG Request constructor rejects these methods, so they are refused before a Request is built.
const hostSettledResponse = HttpServerResponse.empty({
  status: Server.HOST_METHOD_ANSWERS.refusedStatus,
  headers: {allow: Server.HOST_METHOD_ANSWERS.allow},
})

class SsrHandler extends Context.Service<
  SsrHandler,
  {
    readonly render: (
      request: HttpServerRequest.HttpServerRequest
    ) => Effect.Effect<
      HttpServerResponse.HttpServerResponse,
      HttpServerError.HttpServerError,
      Scope.Scope
    >
  }
>()('thisishugo/SsrHandler') {
  static readonly layer = Layer.effect(
    SsrHandler,
    Effect.gen(function* () {
      const {serverEntry} = yield* BuildManifest
      const origin = (yield* Config.schema(Schema.URLFromString, 'ORIGIN'))
        .origin
      const {fetch} = (yield* Effect.tryPromise(
        (): Promise<unknown> => import(pathToFileURL(serverEntry).href)
      ).pipe(
        Effect.flatMap(Schema.decodeUnknownEffect(FetchModule)),
        Effect.mapError((cause) => new BuildError({cause}))
      )).default

      const render = Effect.fn('SsrHandler.render')(function* (
        request: HttpServerRequest.HttpServerRequest
      ) {
        if (Server.isHostSettledMethod(request.method)) {
          return hostSettledResponse
        }
        const requestUrl = Server.resolveRequestUrl(request.url, origin)
        if (requestUrl === undefined) {
          return HttpServerResponse.empty({status: 400})
        }
        const signal = yield* Effect.abortSignal
        const webRequest = yield* HttpServerRequest.toWeb(request, {
          signal,
        }).pipe(
          Effect.mapError(
            (reason) => new HttpServerError.HttpServerError({reason})
          )
        )
        const response = yield* Effect.promise(() =>
          fetch(new Request(requestUrl, webRequest))
        )
        return HttpServerResponse.fromWeb(response)
      })

      return SsrHandler.of({render})
    })
  )
}

const Routes = HttpRouter.use(
  Effect.fn(function* (router) {
    const {clientDirectory} = yield* BuildManifest
    const {render} = yield* SsrHandler
    const page = HttpServerRequest.HttpServerRequest.use(render)

    const assets = yield* HttpStaticServer.make({
      root: clientDirectory,
      cacheControl: 'public, max-age=31536000, immutable',
    })
    const files = yield* HttpStaticServer.make({
      root: clientDirectory,
      cacheControl: 'public, max-age=0, must-revalidate',
    })

    yield* router.add('*', '/', page)
    yield* router.add('*', '/index.html', page)
    yield* router.add('GET', '/assets/*', assets)
    yield* router.add(
      'GET',
      '/*',
      files.pipe(
        Effect.catchReason('HttpServerError', 'RouteNotFound', () => page)
      )
    )
  })
)

export const ProductionServer = HttpRouter.serve(Routes, {
  middleware: policy,
}).pipe(
  Layer.provide(SsrHandler.layer),
  Layer.provide(BuildManifest.layer),
  Layer.provide(Listen)
)
