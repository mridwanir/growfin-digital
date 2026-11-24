/* oxlint-disable react/only-export-components -- Next.js route segment config */
import type { Metadata } from 'next'

import { redirect } from 'next/navigation'

import { OnboardingWizard } from '@/features/auth'
import { getMerchantTenants, getSession } from '@/features/auth/server'

export const metadata: Metadata = {
  description: 'Daftarkan akun dan siapkan website toko online Anda dalam dua langkah mudah.',
  title: 'Onboarding Toko Baru - MeracikWeb',
}

export const instant = false
export default async function OnboardingPage() {
  const { data: session } = await getSession()

  if (session?.user) {
    const tenants = await getMerchantTenants(session.user.id)
    if (tenants.length > 0) {
      redirect('/dashboard')
    }

    return (
      <OnboardingWizard
        initialStep={2}
        userEmail={session.user.email}
        userName={session.user.name}
      />
    )
  }

  return <OnboardingWizard initialStep={1} />
}
