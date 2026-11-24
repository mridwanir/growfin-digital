import ashtrathLint from '@ashtrath/oxc-config/lint'

export default ashtrathLint(
  {
    type: 'app',
    nextjs: true,
    react: true,
    typescript: true,
    antislop: {
      slop: false,
      sonarjs: true,
    },
    tailwindcss: {
      entryPoint: 'src/styles/globals.css',
    },

    ignorePatterns: [
      'migrations/**/*',
      'src/db/migrations/**/*',
      'src/components/ui/**/*.tsx',
      'src/components/demo/**/*',
      'src/lib/site-config.ts',
      'src/lib/themes.ts',
      'src/lib/template-resolver.ts',
      'src/lib/catalog.ts',
    ],
  },
  {
    overrides: [
      {
        files: ['src/**/*.{ts,tsx}'],
        rules: {
          'eslint/no-restricted-imports': [
            'error',
            {
              paths: [
                {
                  name: '@/db/schema',
                  importNames: ['organization', 'Organization', 'NewOrganization'],
                  message:
                    'Features and routes outside auth/db boundary must use Tenant from @/db/schema or @/features/auth.',
                },
                {
                  name: '@/db/schema/auth',
                  importNames: ['organization', 'Organization', 'NewOrganization'],
                  message:
                    'Features and routes outside auth/db boundary must use Tenant from @/db/schema or @/features/auth.',
                },
                {
                  name: '@/db',
                  importNames: ['organization', 'Organization', 'NewOrganization'],
                  message:
                    'Features and routes outside auth/db boundary must use Tenant from @/db/schema or @/features/auth.',
                },
                {
                  name: '@/db/schema/tenants',
                  message:
                    'The legacy tenants schema shim is retired. Use Tenant exports from @/db/schema or @/features/auth.',
                },
              ],
            },
          ],
        },
      },
      {
        files: [
          'src/db/**/*.{ts,tsx}',
          'src/lib/auth/**/*.{ts,tsx}',
          'src/features/auth/**/*.{ts,tsx}',
          'tests/**/*.{ts,tsx}',
        ],
        rules: {
          'eslint/no-restricted-imports': 'off',
        },
      },
      {
        files: ['src/features/*/index.ts'],
        rules: {
          'eslint/no-restricted-imports': [
            'error',
            {
              patterns: [
                {
                  group: ['node:*'],
                  message: 'Client barrels must not import node built-ins.',
                },
                {
                  group: ['@/features/*'],
                  message: 'Client barrels must not re-export from external features.',
                },
              ],
            },
          ],
        },
      },
    ],
  },
)
