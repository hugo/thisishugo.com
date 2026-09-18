import {reactRouter} from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import {defineConfig} from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    target: 'es2025',
  },
  server: {
    port: Number(process.env.PORT ?? 3000),
    allowedHosts: ['thisishugo.com', 'www.thisishugo.com'],
  },
})
