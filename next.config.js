const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|svg|jpg|gif|ico)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]',
        publicPath: `/_next/static/images`,
        outputPath: 'static/images',
      },
    })

    return config
  },
})
