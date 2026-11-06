import ashtrathFmt from '@ashtrath/oxc-config/fmt'

export default ashtrathFmt({
  sortImports: true,
  sortPackageJson: true,
  sortTailwindcss: true,

  ignorePatterns: ['migrations/**/*', 'frontend'],
})
