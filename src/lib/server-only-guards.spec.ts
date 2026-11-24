import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Server-only core infrastructure guards (Ticket #37)', () => {
  it('guards @/db entrypoint with server-only', () => {
    const dbSource = readFileSync(resolve(process.cwd(), 'src/db/index.ts'), 'utf-8')
    expect(dbSource).toMatch(/^import ['"]server-only['"]/m)
  })

  it('guards @/lib/auth/server with server-only', () => {
    const authSource = readFileSync(resolve(process.cwd(), 'src/lib/auth/server.ts'), 'utf-8')
    expect(authSource).toMatch(/^import ['"]server-only['"]/m)
  })
})
describe('Server-only feature slice entrypoint guards (Ticket #39)', () => {
  it('guards @/features/billing/server with server-only', () => {
    const billingSource = readFileSync(
      resolve(process.cwd(), 'src/features/billing/server.ts'),
      'utf-8',
    )
    expect(billingSource).toMatch(/^import ['"]server-only['"]/m)
  })

  it('guards @/features/analytics/server with server-only', () => {
    const analyticsSource = readFileSync(
      resolve(process.cwd(), 'src/features/analytics/server.ts'),
      'utf-8',
    )
    expect(analyticsSource).toMatch(/^import ['"]server-only['"]/m)
  })

  it('guards @/features/generator/server with server-only', () => {
    const generatorSource = readFileSync(
      resolve(process.cwd(), 'src/features/generator/server.ts'),
      'utf-8',
    )
    expect(generatorSource).toMatch(/^import ['"]server-only['"]/m)
  })

  it('guards @/features/dashboard/server with server-only (Ticket #42)', () => {
    const dashboardSource = readFileSync(
      resolve(process.cwd(), 'src/features/dashboard/server.ts'),
      'utf-8',
    )
    expect(dashboardSource).toMatch(/^import ['"]server-only['"]/m)
  })
})

describe('Vitest component discovery (Ticket #37)', () => {
  it('includes all src/**/*.spec.tsx files in component project', () => {
    const vitestConfig = readFileSync(resolve(process.cwd(), 'vitest.config.ts'), 'utf-8')
    expect(vitestConfig).toContain("include: ['src/**/*.spec.tsx']")
  })
})
