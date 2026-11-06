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

  ignorePatterns: ['migrations/**/*', 'src/components/ui/**/*.tsx', 'frontend'],
})
