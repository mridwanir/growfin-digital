import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { requireAdminSession } from '@/lib/auth/admin'

async function AdminContent() {
  const session = await requireAdminSession()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Super Admin Console</h1>
      <p className="text-muted-foreground mt-2">Signed in as Administrator: {session.user.email}</p>
    </main>
  )
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex flex-col gap-2 px-4 py-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  )
}
