import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'

import * as clientModule from './index'
import * as serverModule from './server'

vi.mock('server-only', () => ({}))

describe('Editor feature server-only guards (Ticket #41)', () => {
  it('guards @/features/editor/server with server-only', () => {
    const serverSource = readFileSync(
      resolve(process.cwd(), 'src/features/editor/server.ts'),
      'utf-8',
    )
    expect(serverSource).toMatch(/^import ['"]server-only['"]/m)
  })

  it('guards @/features/editor/actions with server-only and use server', () => {
    const actionsSource = readFileSync(
      resolve(process.cwd(), 'src/features/editor/actions.ts'),
      'utf-8',
    )
    expect(actionsSource).toMatch(/^'use server'/m)
    expect(actionsSource).toMatch(/import ['"]server-only['"]/)
  })

  it('guards @/features/editor/loader with server-only', () => {
    const loaderSource = readFileSync(
      resolve(process.cwd(), 'src/features/editor/loader.ts'),
      'utf-8',
    )
    expect(loaderSource).toMatch(/^import ['"]server-only['"]/m)
  })

  it('exports server loaders and actions from @/features/editor/server', () => {
    expect(serverModule.getStorefrontEditorDraftData).toBeDefined()
    expect(serverModule.saveStorefrontDraftAction).toBeDefined()
    expect(serverModule.publishStorefrontDraftAction).toBeDefined()
    expect(serverModule.discardStorefrontDraftAction).toBeDefined()
  })

  it('exports client compound components from @/features/editor without server-only', () => {
    const indexSource = readFileSync(
      resolve(process.cwd(), 'src/features/editor/index.ts'),
      'utf-8',
    )
    expect(indexSource).not.toMatch(/server-only/)

    expect(clientModule.StorefrontEditor).toBeDefined()
    expect(clientModule.StorefrontEditor.Root).toBeDefined()
    expect(clientModule.StorefrontEditor.Canvas).toBeDefined()
    expect(clientModule.StorefrontEditor.Inspector).toBeDefined()
    expect(clientModule.StorefrontEditor.Sidebar).toBeDefined()
    expect(clientModule.StorefrontEditor.Toolbar).toBeDefined()
    expect(clientModule.useStorefrontEditor).toBeDefined()
  })
})
