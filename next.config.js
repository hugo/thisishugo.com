module.exports = {
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
}
