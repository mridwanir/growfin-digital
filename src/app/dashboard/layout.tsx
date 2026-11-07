import type { ReactNode } from 'react'

import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { getSession } from '@/lib/auth/server'

async function DashboardGuard({ children }: { children: ReactNode }) {
  const { data: session } = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  return children
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Suspense
        fallback={
          <div className="p-8">
            <Skeleton className="h-6 w-48" />
          </div>
        }
      >
        <DashboardGuard>{children}</DashboardGuard>
      </Suspense>
    </div>
  )
}
