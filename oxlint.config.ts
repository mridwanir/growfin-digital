import ashtrathLint from '@ashtrath/oxc-config/lint'

export default ashtrathLint({
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
    'frontend',
  ],
})
