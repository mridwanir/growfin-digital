import type { ReactNode } from 'react'

import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { getSession } from '@/lib/auth/server'
import { getMerchantTenants } from '@/lib/dashboard/mutations'

export async function DashboardGuard({ children }: { children: ReactNode }) {
  const { data: session } = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  const tenants = await getMerchantTenants(session.user.id)
  if (tenants.length === 0) {
    redirect('/onboarding')
  }

  return children
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Suspense
        fallback={
          <div className="container mx-auto flex flex-col gap-4 p-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        }
      >
        <DashboardGuard>{children}</DashboardGuard>
      </Suspense>
    </div>
  )
}
