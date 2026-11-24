import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { TenantStatusBadge, TenantTierBadge } from './tenant-badges'

describe('TenantStatusBadge component', () => {
  it('renders Aktif (Live) for published status', async () => {
    render(<TenantStatusBadge status="published" />)
    const badge = page.getByText('Aktif (Live)')
    await expect.element(badge).toBeVisible()
  })

  it('renders Terkunci (Expired) for locked status', async () => {
    render(<TenantStatusBadge status="locked" />)
    const badge = page.getByText('Terkunci (Expired)')
    await expect.element(badge).toBeVisible()
  })

  it('renders Draft for default or unknown status', async () => {
    render(<TenantStatusBadge status="draft" />)
    const badge = page.getByText('Draft')
    await expect.element(badge).toBeVisible()
  })
})

describe('TenantTierBadge component', () => {
  it('renders PRO for pro tier', async () => {
    render(<TenantTierBadge tier="pro" />)
    const badge = page.getByText('PRO')
    await expect.element(badge).toBeVisible()
  })

  it('renders INSTANT for instant tier', async () => {
    render(<TenantTierBadge tier="instant" />)
    const badge = page.getByText('INSTANT')
    await expect.element(badge).toBeVisible()
  })

  it('renders FREE DEMO for default or unknown tier', async () => {
    render(<TenantTierBadge tier="free" />)
    const badge = page.getByText('FREE DEMO')
    await expect.element(badge).toBeVisible()
  })
})
