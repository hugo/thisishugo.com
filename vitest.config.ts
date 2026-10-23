import {foldkit} from '@foldkit/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import {playwright} from '@vitest/browser-playwright'
import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'server',
          include: ['src/server/**/*.test.ts'],
        },
      },
      {
        plugins: [tailwindcss(), foldkit()],
        test: {
          name: 'client',
          // NOTE: Permissions belong to the shared browser context, so files must not run concurrently.
          fileParallelism: false,
          include: ['src/client/**/*.test.ts'],
          css: {include: [/styles\.css/u]},
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{browser: 'chromium'}],
            commands: {
              grantClipboard: async ({context}) => {
                await context.grantPermissions([
                  'clipboard-read',
                  'clipboard-write',
                ])
              },
              revokePermissions: async ({context}) => {
                await context.clearPermissions()
              },
            },
          },
        },
      },
    ],
  },
})
