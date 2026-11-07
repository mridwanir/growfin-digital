import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { getSession } from '@/lib/auth/server'

async function DashboardContent() {
  const { data: session } = await getSession()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Merchant Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Welcome back, {session?.user?.name || session?.user?.email}
      </p>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex flex-col gap-2 px-4 py-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
