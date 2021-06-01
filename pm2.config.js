module.exports = {
  apps: [
    {
      name: 'Remix',
      script: 'remix run',
      ignore_watch: ['.'],
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'PostCSS',
      script: 'npm run postcss:build:watch',
      watch: ['tailwind.config.js', 'tailwind.css'],
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}
