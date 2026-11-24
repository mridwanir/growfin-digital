import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC_ROOT = resolve(process.cwd(), 'src')

interface SourceFile {
  content: string
  filePath: string
  relativeFile: string
}

function getSourceFiles(dir: string): SourceFile[] {
  const results: SourceFile[] = []
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getSourceFiles(fullPath))
    } else if (/\.(?:ts|tsx)$/.test(entry.name)) {
      results.push({
        content: readFileSync(fullPath, 'utf-8'),
        filePath: fullPath,
        relativeFile: relative(SRC_ROOT, fullPath).replace(/\\/g, '/'),
      })
    }
  }

  return results
}

interface ImportStatement {
  importedSymbols: string
  importPath: string
  line: number
}

function parseImportChunk(stmt: string, line: number, target: ImportStatement[]): void {
  const fromMatch = stmt.match(/from\s+['"]([^'"]+)['"]/)
  if (fromMatch) {
    const importPath = fromMatch[1]
    const beforeFrom = stmt.substring(0, fromMatch.index)
    const symbolsMatch = beforeFrom.match(/(?:import|export)\s+(?:type\s+)?([\s\S]*)/)
    target.push({
      importedSymbols: symbolsMatch ? symbolsMatch[1].trim() : '',
      importPath,
      line,
    })
    return
  }

  const sideEffectMatch = stmt.match(/import\s+['"]([^'"]+)['"]/)
  if (sideEffectMatch) {
    target.push({
      importedSymbols: '',
      importPath: sideEffectMatch[1],
      line,
    })
  }
}
function isStatementClosed(line: string): boolean {
  return line.endsWith("';") || line.endsWith("'") || line.endsWith('"') || line.endsWith('";')
}

function isImportOrExport(line: string): boolean {
  return (
    line.startsWith('import ') ||
    line.startsWith('import type ') ||
    line.startsWith('export ') ||
    line.startsWith('export type ')
  )
}

function extractImports(content: string): ImportStatement[] {
  const imports: ImportStatement[] = []
  const lines = content.split('\n')

  let accumulating = false
  let accumulated = ''
  let startLine = 1

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()

    if (accumulating) {
      accumulated += ` ${trimmed}`
      if (isStatementClosed(trimmed) && trimmed.includes('}')) {
        accumulating = false
        parseImportChunk(accumulated, startLine, imports)
      }
      continue
    }

    if (!isImportOrExport(trimmed)) {
      continue
    }

    if (isStatementClosed(trimmed) && (!trimmed.includes('{') || trimmed.includes('}'))) {
      parseImportChunk(trimmed, i + 1, imports)
    } else {
      accumulating = true
      accumulated = trimmed
      startLine = i + 1
    }
  }

  return imports
}
interface ResolvedFeatureTarget {
  cleanSubpath: string
  targetFeature: string
}

function resolveFeatureTarget(importPath: string, filePath: string): ResolvedFeatureTarget | null {
  if (importPath.startsWith('@/features/')) {
    const parts = importPath.replace('@/features/', '').split('/')
    const targetFeature = parts[0]
    const cleanSubpath = parts
      .slice(1)
      .join('/')
      .replace(/\.(?:ts|tsx)$/, '')
    return { cleanSubpath, targetFeature }
  }

  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    const resolvedPath = resolve(dirname(filePath), importPath)
    const relResolved = relative(SRC_ROOT, resolvedPath).replace(/\\/g, '/')
    if (relResolved.startsWith('features/')) {
      const parts = relResolved.replace('features/', '').split('/')
      const targetFeature = parts[0]
      const cleanSubpath = parts
        .slice(1)
        .join('/')
        .replace(/\.(?:ts|tsx)$/, '')
      return { cleanSubpath, targetFeature }
    }
  }

  return null
}

const ALLOWED_CROSS_FEATURE_SUBPATHS: Record<string, true> = {
  '': true,
  actions: true,
  index: true,
  queries: true,
  server: true,
}

describe('static architecture boundaries (Ticket #43)', () => {
  const allSourceFiles = getSourceFiles(SRC_ROOT)

  describe('feature slice encapsulation', () => {
    it('forbids deep cross-feature imports outside explicit public entry points', () => {
      const violations: string[] = []

      for (const file of allSourceFiles) {
        const currentFeature = file.relativeFile.startsWith('features/')
          ? file.relativeFile.split('/')[1]
          : null

        const imports = extractImports(file.content)
        for (const imp of imports) {
          const resolved = resolveFeatureTarget(imp.importPath, file.filePath)
          if (!resolved || resolved.targetFeature === currentFeature) continue

          if (!ALLOWED_CROSS_FEATURE_SUBPATHS[resolved.cleanSubpath]) {
            violations.push(
              `${file.relativeFile}:${imp.line} imports "${imp.importPath}" from feature "${resolved.targetFeature}". Only public entry points (@/features/${resolved.targetFeature}, @/features/${resolved.targetFeature}/server, @/features/${resolved.targetFeature}/actions, @/features/${resolved.targetFeature}/queries) are allowed for cross-feature imports.`,
            )
          }
        }
      }

      expect(
        violations,
        `Found ${violations.length} deep cross-feature import violation(s):\n${violations.join('\n')}`,
      ).toEqual([])
    })
  })

  describe('better Auth organization vs Tenant boundary', () => {
    it('restricts organization table and schema imports to auth and db boundaries', () => {
      const allowedPrefixes = ['db/', 'lib/auth/', 'features/auth/']
      const violations: string[] = []

      for (const file of allSourceFiles) {
        const isAllowed = allowedPrefixes.some(prefix => file.relativeFile.startsWith(prefix))
        if (isAllowed) continue

        const imports = extractImports(file.content)
        for (const imp of imports) {
          const importsFromAuthSchema =
            imp.importPath.includes('schema/auth') ||
            imp.importPath === '@/db/schema' ||
            imp.importPath === '@/db'
          const mentionsOrg = /\b(?:organization|Organization|NewOrganization)\b/.test(
            imp.importedSymbols,
          )

          if (importsFromAuthSchema && mentionsOrg) {
            violations.push(
              `${file.relativeFile}:${imp.line} imports Better Auth organization ("${imp.importedSymbols}") from "${imp.importPath}". Features and routes outside auth/db boundary must use Tenant from @/db/schema/tenants.`,
            )
          }
        }
      }

      expect(
        violations,
        `Found ${violations.length} organization boundary violation(s):\n${violations.join('\n')}`,
      ).toEqual([])
    })
  })

  describe('shared library layer (src/lib/)', () => {
    it('contains only infrastructure adapters, environment configuration, and generic utilities', () => {
      const allowedTopLevelEntries: Record<string, true> = {
        'architecture-boundaries.spec.ts': true,
        auth: true,
        'color-utils.ts': true,
        email: true,
        'env.ts': true,
        'section-utils.ts': true,
        'server-only-guards.spec.ts': true,
        'site-config.ts': true,
        storage: true,
        'utils.ts': true,
      }

      const libEntries = readdirSync(resolve(SRC_ROOT, 'lib'))
      const unexpected = libEntries.filter(entry => !allowedTopLevelEntries[entry])

      expect(unexpected, `Unexpected entries in src/lib/: ${unexpected.join(', ')}`).toEqual([])
    })

    it('has no empty directories in src/components or src/lib', () => {
      function findEmptyDirectories(dir: string): string[] {
        const emptyDirs: string[] = []
        const entries = readdirSync(dir, { withFileTypes: true })
        if (entries.length === 0) {
          emptyDirs.push(relative(SRC_ROOT, dir).replace(/\\/g, '/'))
        } else {
          for (const entry of entries) {
            if (entry.isDirectory()) {
              const subDir = join(dir, entry.name)
              emptyDirs.push(...findEmptyDirectories(subDir))
            }
          }
        }
        return emptyDirs
      }

      const emptyInComponents = findEmptyDirectories(resolve(SRC_ROOT, 'components'))
      const emptyInLib = findEmptyDirectories(resolve(SRC_ROOT, 'lib'))

      expect(emptyInComponents).toEqual([])
      expect(emptyInLib).toEqual([])
    })
  })

  describe('ui primitives, brand assets, and hooks separation', () => {
    it('maintains clean separation between ui primitives, brand assets, and hooks', () => {
      const componentEntries = readdirSync(resolve(SRC_ROOT, 'components'))
      const allowedComponentDirs: Record<string, true> = {
        brand: true,
        ui: true,
      }
      const unexpectedComponentDirs = componentEntries.filter(entry => !allowedComponentDirs[entry])

      expect(
        unexpectedComponentDirs,
        `src/components/ should only contain ui/ and brand/: ${unexpectedComponentDirs.join(', ')}`,
      ).toEqual([])

      const hookFiles = readdirSync(resolve(SRC_ROOT, 'hooks'))
      for (const file of hookFiles) {
        expect(file).toMatch(/^use-[a-z0-9-]+\.(?:ts|tsx)$/)
      }
    })
  })
})
