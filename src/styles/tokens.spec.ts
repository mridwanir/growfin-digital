import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function parseCssVariables(cssContent: string) {
  const rootMatch = cssContent.match(/:root\s*\{([^}]+)\}/)
  const darkMatch = cssContent.match(/\.dark\s*\{([^}]+)\}/)

  const parseBlock = (block: string | undefined): Record<string, string> => {
    if (!block) return {}
    const vars: Record<string, string> = {}
    for (const line of block.split('\n')) {
      const trimmed = line.trim()
      if (trimmed.startsWith('--')) {
        const [key, ...rest] = trimmed.split(':')
        const val = rest.join(':').replace(/;$/, '').trim()
        if (key && val) {
          vars[key.trim()] = val
        }
      }
    }
    return vars
  }

  return {
    dark: parseBlock(darkMatch?.[1]),
    root: parseBlock(rootMatch?.[1]),
  }
}

describe('semantic color tokens and contrast calibration (ticket 01)', () => {
  const globalsCssPath = resolve(__dirname, 'globals.css')
  const cssContent = readFileSync(globalsCssPath, 'utf8')
  const { root, dark } = parseCssVariables(cssContent)

  describe('light mode tokens (:root)', () => {
    it('configures calibrated electric blue for primary', () => {
      expect(root['--primary']).toBe('oklch(0.53 0.22 260)')
    })

    it('configures ice white for primary foreground', () => {
      expect(root['--primary-foreground']).toBe('oklch(0.985 0 0)')
    })

    it('calibrates border token to oklch(0.80 0.02 260)', () => {
      expect(root['--border']).toBe('oklch(0.80 0.02 260)')
    })

    it('aligns input token with border', () => {
      expect(root['--input']).toBe('oklch(0.80 0.02 260)')
    })

    it('configures ring consistently with primary', () => {
      expect(root['--ring']).toBe('oklch(0.53 0.22 260)')
    })

    it('configures sidebar tokens consistently with primary and border', () => {
      expect(root['--sidebar-primary']).toBe('oklch(0.53 0.22 260)')
      expect(root['--sidebar-primary-foreground']).toBe('oklch(0.985 0 0)')
      expect(root['--sidebar-border']).toBe('oklch(0.80 0.02 260)')
      expect(root['--sidebar-ring']).toBe('oklch(0.53 0.22 260)')
    })
  })

  describe('dark mode tokens (.dark)', () => {
    it('calibrates dark background to deep midnight oklch(0.145 0 0)', () => {
      expect(dark['--background']).toBe('oklch(0.145 0 0)')
    })

    it('calibrates dark primary to sky cyan oklch(0.84 0.099 230.1)', () => {
      expect(dark['--primary']).toBe('oklch(0.84 0.099 230.1)')
    })

    it('configures dark primary foreground to deep midnight oklch(0.145 0 0)', () => {
      expect(dark['--primary-foreground']).toBe('oklch(0.145 0 0)')
    })

    it('calibrates dark border for non-text contrast', () => {
      expect(dark['--border']).toBe('oklch(1 0 0 / 15%)')
    })

    it('calibrates dark input token consistently with border', () => {
      expect(dark['--input']).toBe('oklch(1 0 0 / 15%)')
    })

    it('configures dark ring consistently with primary', () => {
      expect(dark['--ring']).toBe('oklch(0.84 0.099 230.1)')
    })

    it('configures dark sidebar tokens consistently with primary and border', () => {
      expect(dark['--sidebar-primary']).toBe('oklch(0.84 0.099 230.1)')
      expect(dark['--sidebar-primary-foreground']).toBe('oklch(0.145 0 0)')
      expect(dark['--sidebar-border']).toBe('oklch(1 0 0 / 15%)')
      expect(dark['--sidebar-ring']).toBe('oklch(0.84 0.099 230.1)')
    })
  })
})
