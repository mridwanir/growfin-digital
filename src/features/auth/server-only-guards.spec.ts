import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'

import * as serverModule from './server'

vi.mock('server-only', () => ({}))

describe('Auth feature server-only guards (Ticket #38)', () => {
  it('guards @/features/auth/server with server-only', () => {
    const serverSource = readFileSync(
      resolve(process.cwd(), 'src/features/auth/server.ts'),
      'utf-8',
    )
    expect(serverSource).toMatch(/^import ['"]server-only['"]/m)
  })

  it('guards @/features/auth/actions with server-only and use server', () => {
    const actionsSource = readFileSync(
      resolve(process.cwd(), 'src/features/auth/actions.ts'),
      'utf-8',
    )
    expect(actionsSource).toMatch(/^'use server'/m)
    expect(actionsSource).toMatch(/import ['"]server-only['"]/)
  })

  it('exports canonical Tenant helpers from @/features/auth/server', () => {
    expect(serverModule.resolveActiveTenantContext).toBeDefined()
    expect(serverModule.requireActiveTenantContext).toBeDefined()
    expect(serverModule.getMerchantTenants).toBeDefined()
  })
})
