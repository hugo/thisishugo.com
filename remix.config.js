/** @type {import('@remix-run/dev').AppConfig} */
export default {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildPath: './build/index.js',
  serverModuleFormat: 'esm',
  ignoredRouteFiles: ['*/*.test.tsx'],
  tailwind: true,
  dev: {
    port: 8002,
  },
}
