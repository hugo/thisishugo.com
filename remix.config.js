/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildPath: './build/index.js',
  serverModuleFormat: 'cjs',
  ignoredRouteFiles: ['*/*.test.tsx'],
  tailwind: true,
  future: {
    v2_dev: {
      port: 8002,
    },
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: {},
  },
}
