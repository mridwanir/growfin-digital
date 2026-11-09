import type { ReactNode } from 'react'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getSession } from '@/lib/auth/server'

async function DashboardGuard({ children }: { children: ReactNode }) {
  const { data: session } = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border/60 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-2 font-bold tracking-tight text-lg" href="/dashboard">
              <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-xs font-black">
                G
              </span>
              <span>Growfin Merchant</span>
            </Link>

            <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
              <Link
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md px-3 py-1.5 transition-colors"
                href="/dashboard"
              >
                Overview
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md px-3 py-1.5 transition-colors"
                href="/dashboard/settings"
              >
                Settings
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md px-3 py-1.5 transition-colors"
                href="/dashboard/products"
              >
                Products & Variants
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-muted-foreground hidden text-xs sm:inline-block">
              {session.user.email}
            </span>
            <Link className={buttonVariants({ size: 'sm', variant: 'outline' })} href="/">
              Buat Toko Baru
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  )
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
