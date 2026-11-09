import {
  ExternalLink,
  MapPin,
  Package,
  Phone,
  PlusCircle,
  Settings,
  Store,
} from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getSession } from '@/lib/auth/server'
import { getMerchantTenants } from '@/lib/dashboard/mutations'
import { env } from '@/lib/env'

async function MerchantOverview() {
  const { data: session } = await getSession()
  if (!session?.user?.id) return null

  const tenantList = await getMerchantTenants(session.user.id)
  const baseDomain = env.NEXT_PUBLIC_BASE_DOMAIN

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Aktif (Live)
          </span>
        )
      case 'locked':
        return (
          <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-600 dark:text-rose-400">
            Terkunci (Expired)
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            Draft
          </span>
        )
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'pro':
        return (
          <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-600 dark:text-purple-400">
            PRO
          </span>
        )
      case 'instant':
        return (
          <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
            INSTANT
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            FREE DEMO
          </span>
        )
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Merchant Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Selamat datang, {session.user.name || session.user.email}. Kelola profil toko dan katalog
            produk Anda.
          </p>
        </div>

        <Link
          href="/"
          className={buttonVariants({
            className: 'self-start sm:self-auto',
          })}
        >
          <PlusCircle className="mr-2 size-4" />
          Buat Website Baru
        </Link>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between pb-4">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Toko & Website Anda ({tenantList.length})
          </h2>
        </div>

        {tenantList.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Store className="text-muted-foreground size-12 stroke-1" />
            <h3 className="font-heading mt-4 text-base font-semibold">Belum Ada Website</h3>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
              Anda belum memiliki website toko aktif. Buat website instan dalam 30 detik untuk bisnis Anda.
            </p>
            <Link className={buttonVariants({ className: 'mt-6' })} href="/">
              Mulai Buat Website
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tenantList.map(tenant => {
              const liveUrl =
                tenant.status === 'published'
                  ? `https://${tenant.slug}.${baseDomain}`
                  : `/demo/${tenant.slug}`

              return (
                <Card key={tenant.id} className="flex flex-col justify-between shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {getStatusBadge(tenant.status)}
                        {getTierBadge(tenant.packageTier)}
                      </div>
                      <span className="text-muted-foreground truncate text-xs font-mono">
                        {tenant.slug}
                      </span>
                    </div>

                    <CardTitle className="mt-3 text-lg">{tenant.name}</CardTitle>
                    <CardDescription>{tenant.category}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2 text-xs">
                    {tenant.city && (
                      <div className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="size-3.5 shrink-0" />
                        <span className="truncate">{tenant.city}</span>
                      </div>
                    )}
                    {tenant.phone && (
                      <div className="text-muted-foreground flex items-center gap-2">
                        <Phone className="size-3.5 shrink-0" />
                        <span>{tenant.phone}</span>
                      </div>
                    )}
                    {tenant.customDomain && (
                      <div className="text-muted-foreground flex items-center gap-2 font-mono">
                        <ExternalLink className="size-3.5 shrink-0" />
                        <span className="text-primary truncate">{tenant.customDomain}</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                    <Link
                      className={buttonVariants({ size: 'sm', variant: 'outline' })}
                      href={`/dashboard/settings?tenant=${tenant.id}`}
                    >
                      <Settings className="mr-1.5 size-3.5" />
                      Pengaturan
                    </Link>

                    <Link
                      className={buttonVariants({ size: 'sm', variant: 'outline' })}
                      href={`/dashboard/products?tenant=${tenant.id}`}
                    >
                      <Package className="mr-1.5 size-3.5" />
                      Katalog Produk
                    </Link>

                    <Link
                      href={liveUrl}
                      rel="noreferrer"
                      target="_blank"
                      className={buttonVariants({
                        className: 'w-full sm:w-auto flex items-center gap-1.5',
                        size: 'sm',
                        variant: 'default',
                      })}
                    >
                      <ExternalLink className="size-3.5" />
                      Buka Toko
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
          <Skeleton className="h-10 w-72" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      }
    >
      <MerchantOverview />
    </Suspense>
  )
}
