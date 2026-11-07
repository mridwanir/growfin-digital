import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
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
    alias: {
      'next/headers': 'next/headers.js',
      'next/navigation': 'next/navigation.js',
    },
  },
  test: {
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
          exclude: [...defaultExclude, 'src/hooks/**/*.spec.ts'],
          include: ['src/**/*.spec.{js,ts}', 'tests/**/*.spec.{js,ts}'],
        },
      },
      {
        test: {
          name: 'components',
          include: ['src/**/*.spec.{jsx,tsx}'],
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            provider: playwright(),
          },
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
