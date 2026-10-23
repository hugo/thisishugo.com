import {Array, Effect, Match, Option} from 'effect'
import {HttpServerResponse} from 'effect/http'
import {Server} from 'foldkit/experimental'
import {fromString as urlFromString} from 'foldkit/url'

import {init} from '../client/main.ts'
import {AppRoute, urlToAppRoute} from '../client/route.ts'
import {view} from '../client/view.ts'
import {headMarkup} from './metadata.ts'

// NOTE: The Vite dev server resolves no stylesheet assets, so the source stylesheet is linked to avoid an unstyled first paint.
export const DEV_STYLESHEET = '/src/client/styles.css?direct'

export const renderDocument: Server.DocumentRenderer = (application, assets) =>
  Server.renderDocument(
    application,
    {
      ...assets,
      stylesheets: Array.match(assets.stylesheets, {
        onEmpty: () => [DEV_STYLESHEET],
        onNonEmpty: () => assets.stylesheets,
      }),
    },
    {head: headMarkup}
  )

export const statusFor = (requestUrl: string) =>
  urlFromString(requestUrl).pipe(
    Option.map(urlToAppRoute),
    Option.match({
      onNone: () => 404,
      onSome: (route) =>
        AppRoute.match(route, {Home: () => 200, NotFound: () => 404}),
    })
  )

const render = (request: Request) =>
  Server.renderToString({routing: {}, init, view}, {url: request.url}).pipe(
    Effect.map((application) =>
      Server.Rendered(application, {
        status: statusFor(request.url),
        headers: {'cache-control': 'private, no-store'},
      })
    )
  )

export const renderPage = (request: Request): Promise<Server.EntryResult> =>
  Match.value(request).pipe(
    Match.when(
      ({method}) => method !== 'GET' && method !== 'HEAD',
      () =>
        Effect.succeed(
          Server.Responded(
            HttpServerResponse.toWeb(
              HttpServerResponse.text('Method Not Allowed', {
                status: 405,
                headers: {allow: 'GET, HEAD'},
              })
            )
          )
        )
    ),
    Match.orElse(render),
    Effect.runPromise
  )
