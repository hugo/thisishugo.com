module.exports = {
  apps: [
    {
      name: 'Express',
      script: 'ts-node-dev server.ts',
      watch: ['build/assets.json'],
      watch_options: {
        followSymlinks: false,
      },
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'Remix',
      script: 'remix watch',
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
