import type { ReactNode } from 'react'

import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { requireAdminSession } from '@/lib/auth/admin'

async function AdminGuard({ children }: { children: ReactNode }) {
  await requireAdminSession()
  return children
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Suspense
        fallback={
          <div className="p-8">
            <Skeleton className="h-6 w-48" />
          </div>
        }
      >
        <AdminGuard>{children}</AdminGuard>
      </Suspense>
    </div>
  )
}
