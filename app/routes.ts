import {type RouteConfig, route, index} from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),
  route('*', './routes/404.tsx'),
] satisfies RouteConfig
