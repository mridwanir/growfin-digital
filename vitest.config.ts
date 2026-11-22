import { loadEnvConfig } from '@next/env'
import react from '@vitejs/plugin-react'
import { defaultExclude, defineConfig } from 'vitest/config'

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
        test: {
          name: 'components',
          environment: 'node',
          include: ['src/**/*.spec.tsx'],
        },
      },
      {
        test: {
          name: 'integration',
          environment: 'node',
          hookTimeout: 15000,
          include: ['tests/integration/**/*.spec.ts'],
          testTimeout: 15000,
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
