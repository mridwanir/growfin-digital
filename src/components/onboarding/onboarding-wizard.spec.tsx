import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { authClient } from '@/lib/auth/client'

import { OnboardingWizard } from './onboarding-wizard'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}))

vi.mock('@/lib/auth/client', () => ({
  authClient: {
    signIn: {
      social: vi
        .fn()
        .mockResolvedValue({ data: { url: 'https://accounts.google.com' }, error: null }),
    },
    signUp: {
      email: vi.fn().mockResolvedValue({ data: { user: { id: 'u-123' } }, error: null }),
    },
  },
}))

vi.mock('@/lib/onboarding/actions', () => ({
  createStoreOnboardingAction: vi.fn().mockResolvedValue({
    data: { organizationId: 'org-123', redirectUrl: '/dashboard', slug: 'toko-kopi' },
    redirect: '/dashboard',
    success: true,
  }),
}))

describe('OnboardingWizard browser mode component', () => {
  it('renders step 1 account credentials form by default', async () => {
    render(<OnboardingWizard initialStep={1} />)

    const stepHeading = page.getByRole('heading', { name: 'Mulai Bersama MeracikWeb' })
    await expect.element(stepHeading).toBeVisible()

    const nameInput = page.getByLabelText('Nama Lengkap')
    await expect.element(nameInput).toBeVisible()

    const emailInput = page.getByLabelText('Alamat Email')
    await expect.element(emailInput).toBeVisible()

    const passwordInput = page.getByLabelText('Kata Sandi')
    await expect.element(passwordInput).toBeVisible()

    const submitBtn = page.getByRole('button', { name: 'Lanjut ke Detail Toko' })
    await expect.element(submitBtn).toBeVisible()
  })

  it('renders step 2 store info form with Indonesian microcopy when initialStep is 2', async () => {
    render(
      <OnboardingWizard initialStep={2} userEmail="budi@example.com" userName="Budi Santoso" />,
    )

    const stepHeading = page.getByRole('heading', { name: 'Atur Toko Online Anda' })
    await expect.element(stepHeading).toBeVisible()

    const storeNameInput = page.getByLabelText('Nama Toko / Usaha')
    await expect.element(storeNameInput).toBeVisible()

    const slugInput = page.getByLabelText('Alamat Link Toko')
    await expect.element(slugInput).toBeVisible()

    const categorySelect = page.getByLabelText('Kategori Usaha')
    await expect.element(categorySelect).toBeVisible()

    const phoneInput = page.getByLabelText('Nomor WhatsApp')
    await expect.element(phoneInput).toBeVisible()

    const submitBtn = page.getByRole('button', { name: 'Buat Toko & Buka Dashboard' })
    await expect.element(submitBtn).toBeVisible()
  })

  it('auto-generates slug when typing store name in step 2', async () => {
    render(
      <OnboardingWizard initialStep={2} userEmail="budi@example.com" userName="Budi Santoso" />,
    )

    const storeNameInput = page.getByLabelText('Nama Toko / Usaha')
    const slugInput = page.getByLabelText('Alamat Link Toko')

    await storeNameInput.fill('Kopi Kenangan Mantap')
    await expect.element(slugInput).toHaveValue('kopi-kenangan-mantap')
  })

  it('triggers Google OAuth sign-in when clicking Google button in step 1', async () => {
    render(<OnboardingWizard initialStep={1} />)

    const googleBtn = page.getByRole('button', { name: /google/i })
    await expect.element(googleBtn).toBeVisible()
    await googleBtn.click()

    expect(authClient.signIn.social).toHaveBeenCalledWith({
      callbackURL: '/dashboard',
      provider: 'google',
    })
  })
})
