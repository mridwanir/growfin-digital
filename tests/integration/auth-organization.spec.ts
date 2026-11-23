import { describe, expect, it } from 'vitest'

import { authClient } from '@/lib/auth/client'
import { auth } from '@/lib/auth/server'

describe('Better Auth Organization Plugin (Issue 12)', () => {
  it('registers organization plugin on auth server and exposes organization endpoints', () => {
    expect(auth.api).toHaveProperty('createOrganization')
    expect(auth.api).toHaveProperty('getFullOrganization')
    expect(auth.api).toHaveProperty('setActiveOrganization')
    expect(auth.api).toHaveProperty('listOrganizations')
  })

  it('registers organization client plugin on authClient', () => {
    expect(authClient.organization).toBeDefined()
  })
})
