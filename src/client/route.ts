import {Schema, pipe} from 'effect'
import {Route} from 'foldkit'
import {defineRouteUnion, literal} from 'foldkit/route'

export const AppRoute = defineRouteUnion({
  Home: {},
  NotFound: {path: Schema.String},
})
export type AppRoute = typeof AppRoute.Type

export const homeRouter = pipe(Route.root, Route.mapTo(AppRoute.Home))

const indexRouter = pipe(literal('index.html'), Route.mapTo(AppRoute.Home))

export const urlToAppRoute = Route.parseUrlWithFallback(
  Route.oneOf(indexRouter, homeRouter),
  AppRoute.NotFound
)
