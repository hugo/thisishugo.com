import {reactRouter} from '@react-router/dev/vite'
import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    port: Number(process.env.PORT ?? 3000),
    allowedHosts: ['thisishugo.com', 'www.thisishugo.com'],
  },
})
