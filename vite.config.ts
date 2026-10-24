import {foldkit} from '@foldkit/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import {defineConfig} from 'vite'

import {Logging} from './src/server/logging.ts'

export default defineConfig({
  server: {allowedHosts: ['.local']},
  plugins: [
    tailwindcss(),
    foldkit({
      logger: Logging,
      ssr: {
        serverEntry: '/src/server/entry.ts',
        clientEntry: '/src/client/entry.ts',
        build: true,
      },
    }),
  ],
  optimizeDeps: {entries: ['src/client/entry.ts']},
  build: {target: 'es2025'},
})
