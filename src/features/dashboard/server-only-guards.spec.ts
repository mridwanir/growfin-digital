import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'

import * as clientModule from './index'
import * as serverModule from './server'

vi.mock('server-only', () => ({}))

describe('Dashboard feature server-only guards (Ticket #42)', () => {
  it('guards @/features/dashboard/server with server-only', () => {
    const serverSource = readFileSync(
      resolve(process.cwd(), 'src/features/dashboard/server.ts'),
      'utf-8',
    )
    expect(serverSource).toMatch(/^import ['"]server-only['"]/m)
  })

  it('guards @/features/dashboard/actions with server-only and use server', () => {
    const actionsSource = readFileSync(
      resolve(process.cwd(), 'src/features/dashboard/actions.ts'),
      'utf-8',
    )
    expect(actionsSource).toMatch(/^'use server'/m)
    expect(actionsSource).toMatch(/import ['"]server-only['"]/)
  })

  it('guards @/features/dashboard/queries with server-only', () => {
    const queriesSource = readFileSync(
      resolve(process.cwd(), 'src/features/dashboard/queries.ts'),
      'utf-8',
    )
    expect(queriesSource).toMatch(/^import ['"]server-only['"]/m)
  })

  it('exports server queries, mutations, and actions from @/features/dashboard/server', () => {
    // Queries
    expect(serverModule.getMerchantTenants).toBeDefined()
    expect(serverModule.getTenantBySlug).toBeDefined()
    expect(serverModule.getTenantSettings).toBeDefined()
    expect(serverModule.getTenantCategories).toBeDefined()
    expect(serverModule.getTenantProducts).toBeDefined()

    // Mutations
    expect(serverModule.updateTenantSettings).toBeDefined()
    expect(serverModule.createCategory).toBeDefined()
    expect(serverModule.updateCategory).toBeDefined()
    expect(serverModule.deleteCategory).toBeDefined()
    expect(serverModule.createProduct).toBeDefined()
    expect(serverModule.updateProduct).toBeDefined()
    expect(serverModule.deleteProduct).toBeDefined()

    // Server Actions
    expect(serverModule.updateTenantSettingsAction).toBeDefined()
    expect(serverModule.createProductCategoryAction).toBeDefined()
    expect(serverModule.updateProductCategoryAction).toBeDefined()
    expect(serverModule.deleteProductCategoryAction).toBeDefined()
    expect(serverModule.createProductAction).toBeDefined()
    expect(serverModule.updateProductAction).toBeDefined()
    expect(serverModule.deleteProductAction).toBeDefined()
  })

  it('exports client components from @/features/dashboard without server-only', () => {
    const indexSource = readFileSync(
      resolve(process.cwd(), 'src/features/dashboard/index.ts'),
      'utf-8',
    )
    expect(indexSource).not.toMatch(/server-only/)

    expect(clientModule.DashboardShell).toBeDefined()
    expect(clientModule.DashboardOverview).toBeDefined()
    expect(clientModule.ProductsClient).toBeDefined()
    expect(clientModule.SettingsClient).toBeDefined()
    expect(clientModule.MediaUploader).toBeDefined()
    expect(clientModule.TenantStatusBadge).toBeDefined()
    expect(clientModule.TenantTierBadge).toBeDefined()
    expect(clientModule.DashboardSidebar).toBeDefined()
    expect(clientModule.NavMain).toBeDefined()
    expect(clientModule.NavUser).toBeDefined()
    expect(clientModule.TenantSwitcher).toBeDefined()
  })
})
