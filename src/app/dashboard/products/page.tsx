import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/server'
import { getMerchantTenants } from '@/lib/dashboard/mutations'

interface LegacyProductsPageProps {
  searchParams?: Promise<{ tenant?: string }>
}

export default async function LegacyProductsPage({ searchParams }: LegacyProductsPageProps) {
  const { data: session } = await getSession()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const tenants = await getMerchantTenants(session.user.id)
  if (tenants.length === 0) {
    redirect('/dashboard')
  }

  const resolvedParams = searchParams ? await searchParams : undefined
  const tenantParam = resolvedParams?.tenant

  if (tenantParam) {
    const matched = tenants.find(t => t.id === tenantParam || t.slug === tenantParam)
    if (matched) {
      redirect(`/dashboard/${matched.slug}/products`)
    }
  }

  if (tenants.length === 1) {
    redirect(`/dashboard/${tenants[0].slug}/products`)
  }

  redirect('/dashboard')
}
