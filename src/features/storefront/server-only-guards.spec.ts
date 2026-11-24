import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'

import * as clientModule from './index'
import * as serverModule from './server'

vi.mock('server-only', () => ({}))

describe('Storefront feature server-only guards (Ticket #40)', () => {
  it('guards @/features/storefront/server with server-only', () => {
    const serverSource = readFileSync(
      resolve(process.cwd(), 'src/features/storefront/server.ts'),
      'utf-8',
    )
    expect(serverSource).toMatch(/^import ['"]server-only['"]/m)
  })

  it('guards @/features/storefront/loader with server-only', () => {
    const loaderSource = readFileSync(
      resolve(process.cwd(), 'src/features/storefront/loader.ts'),
      'utf-8',
    )
    expect(loaderSource).toMatch(/^import ['"]server-only['"]/m)
  })

  it('exports server loaders from @/features/storefront/server', () => {
    expect(serverModule.getStorefrontDataBySlug).toBeDefined()
    expect(serverModule.getStorefrontDraftDataBySlug).toBeDefined()
  })

  it('exports client/shared components from @/features/storefront without server-only', () => {
    const indexSource = readFileSync(
      resolve(process.cwd(), 'src/features/storefront/index.ts'),
      'utf-8',
    )
    expect(indexSource).not.toMatch(/server-only/)

    expect(clientModule.StorefrontClientIslands).toBeDefined()
    expect(clientModule.StorefrontPreviewClient).toBeDefined()
    expect(clientModule.ProductCatalog).toBeDefined()
    expect(clientModule.formatCurrency).toBeDefined()
  })
})
