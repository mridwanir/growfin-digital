/* oxlint-disable react/only-export-components -- Next.js route segment config */
import type { Metadata } from 'next'

import { redirect } from 'next/navigation'

import { OnboardingWizard } from '@/features/auth'
import { getSession } from '@/features/auth/server'
import { getMerchantTenants } from '@/lib/dashboard/mutations'

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
