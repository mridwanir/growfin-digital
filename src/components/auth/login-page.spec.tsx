import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import LoginPage from '@/app/login/page'
import { authClient } from '@/lib/auth/client'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}))

vi.mock('@/lib/auth/client', () => ({
  authClient: {
    requestPasswordReset: vi.fn().mockResolvedValue({ error: null }),
    signIn: {
      email: vi.fn().mockResolvedValue({ error: null }),
      social: vi
        .fn()
        .mockResolvedValue({ data: { url: 'https://accounts.google.com' }, error: null }),
    },
  },
}))

describe('LoginPage component', () => {
  it('renders Google sign-in button alongside credentials form', async () => {
    render(<LoginPage />)

    const googleBtn = page.getByRole('button', { name: /google/i })
    await expect.element(googleBtn).toBeVisible()
  })

  it('triggers Google OAuth sign-in when clicking Google button', async () => {
    render(<LoginPage />)

    const googleBtn = page.getByRole('button', { name: /google/i })
    await expect.element(googleBtn).toBeVisible()
    await googleBtn.click()

    expect(authClient.signIn.social).toHaveBeenCalledWith({
      callbackURL: '/dashboard',
      provider: 'google',
    })
  })
})
