import nextEnv from '@next/env'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { fileURLToPath } from 'node:url'
import { defaultExclude, defineConfig } from 'vitest/config'

const { loadEnvConfig } = nextEnv

export default defineConfig({
  plugins: [react()],
  oxc: {
    jsx: {
      importSource: 'react',
      runtime: 'automatic',
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    env: loadEnvConfig(process.cwd()).parsedEnv,
    fsModuleCache: true,
    reporters: ['default', process.env.CI ? 'github-actions' : {}],
    coverage: {
      exclude: ['src/**/*.stories.{js,jsx,ts,tsx}'],
      include: ['src/**/*.{ts,tsx}'],
    },
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          exclude: [...defaultExclude, 'src/**/*.spec.tsx'],
          include: ['src/**/*.spec.ts'],
        },
      },
      {
        define: {
          'process.env': {},
        },
        resolve: {
          alias: {
            'next/image': fileURLToPath(
              new URL('./src/components/storefront/__fixtures__/mock-image.tsx', import.meta.url),
            ),
          },
        },
        test: {
          name: 'components',
          include: ['src/components/**/*.spec.tsx'],
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            provider: playwright(),
          },
        },
      },
      {
        test: {
          name: 'integration',
          environment: 'node',
          fileParallelism: false,
          globalSetup: ['./tests/integration/global-setup.ts'],
          hookTimeout: 15000,
          include: ['tests/integration/**/*.spec.ts', 'tests/fixtures/**/*.spec.ts'],
          setupFiles: ['./tests/integration/setup.ts'],
        },
      },
    ],
    server: {
      deps: {
        inline: ['@neon/auth'],
      },
    },
  },
})
