import {
  ExternalLink,
  LayoutDashboard,
  MapPin,
  Package,
  Phone,
  PlusCircle,
  Settings,
  Store,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { MeracikWordmark } from '@/components/brand'
import { TenantStatusBadge, TenantTierBadge } from '@/components/dashboard/tenant-badges'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getSession } from '@/lib/auth/server'
import { getTenantAnalyticsMetrics } from '@/lib/dashboard/analytics'
import { getMerchantTenants } from '@/lib/dashboard/mutations'
import { env } from '@/lib/env'

function OverviewHeader({ email }: { email: string | null | undefined }) {
  return (
    <header className="border-border/60 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            aria-label="MeracikWeb Merchant Dashboard"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight"
            href="/dashboard"
          >
            <span
              aria-hidden="true"
              className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-xs font-black select-none"
            >
              M
            </span>
            <span className="flex items-center gap-1.5">
              <MeracikWordmark size="sm" />
              <span className="text-muted-foreground text-sm font-semibold">Merchant</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            <Link
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md px-3 py-1.5 transition-colors"
              href="/dashboard"
            >
              Overview
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {email && (
            <span className="text-muted-foreground hidden text-xs sm:inline-block">{email}</span>
          )}
          <Link className={buttonVariants({ size: 'sm', variant: 'outline' })} href="/">
            Buat Toko Baru
          </Link>
        </div>
      </div>
    </header>
  )
}

export default async function DashboardPage() {
  const { data: session } = await getSession()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const tenants = await getMerchantTenants(session.user.id)

  if (tenants.length === 1) {
    redirect(`/dashboard/${tenants[0].slug}`)
  }

  if (tenants.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <OverviewHeader email={session.user.email} />
        <main className="container mx-auto flex-1 px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight">Merchant Dashboard</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Selamat datang, {session.user.name || session.user.email}. Kelola profil toko dan
                katalog produk Anda.
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
                Toko & Website Anda (0)
              </h2>
            </div>

            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <Store className="text-muted-foreground size-12 stroke-1" />
              <h3 className="font-heading mt-4 text-base font-semibold">Belum Ada Website</h3>
              <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                Anda belum memiliki website toko aktif. Buat website instan dalam 30 detik untuk
                bisnis Anda.
              </p>
              <Link className={buttonVariants({ className: 'mt-6' })} href="/">
                Mulai Buat Website
              </Link>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const baseDomain = env.NEXT_PUBLIC_BASE_DOMAIN
  const analyticsEntries = await Promise.all(
    tenants.map(async tenant => {
      const tenantMetrics = await getTenantAnalyticsMetrics(tenant.id, session.user.id)
      return [tenant.id, tenantMetrics] as const
    }),
  )
  const analyticsByTenant = new Map(analyticsEntries)

  return (
    <div className="flex min-h-screen flex-col">
      <OverviewHeader email={session.user.email} />
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">Merchant Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Selamat datang, {session.user.name || session.user.email}. Kelola profil toko dan
              katalog produk Anda.
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
              Toko & Website Anda ({tenants.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tenants.map(tenant => {
              const liveUrl =
                tenant.status === 'published'
                  ? `https://${tenant.slug}.${baseDomain}`
                  : `/demo/${tenant.slug}`

              const metrics = analyticsByTenant.get(tenant.id) ?? {
                checkoutCompletes: 0,
                checkoutStarts: 0,
                conversionRate: 0,
                pageViews: 0,
                topSources: [],
                uniqueVisitors: 0,
              }

              return (
                <Card key={tenant.id} className="flex flex-col justify-between shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <TenantStatusBadge status={tenant.status} />
                        <TenantTierBadge tier={tenant.packageTier} />
                      </div>
                      <span className="text-muted-foreground truncate font-mono text-xs">
                        {tenant.slug}
                      </span>
                    </div>

                    <CardTitle className="mt-3 text-lg">
                      <Link className="hover:underline" href={`/dashboard/${tenant.slug}`}>
                        {tenant.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>{tenant.category}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 text-xs">
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

                    <div className="space-y-2 border-t pt-3">
                      <div className="text-muted-foreground flex items-center justify-between font-medium">
                        <span>Statistik Hari Ini</span>
                        <span>{metrics.conversionRate}% konversi</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground text-[10px]">Tayangan</div>
                          <div className="text-sm font-semibold">{metrics.pageViews}</div>
                        </div>
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground text-[10px]">Pengunjung Unik</div>
                          <div className="text-sm font-semibold">{metrics.uniqueVisitors}</div>
                        </div>
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground text-[10px]">Mulai Checkout</div>
                          <div className="text-sm font-semibold">{metrics.checkoutStarts}</div>
                        </div>
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground text-[10px]">Selesai Order</div>
                          <div className="text-sm font-semibold">{metrics.checkoutCompletes}</div>
                        </div>
                      </div>

                      <div className="text-muted-foreground text-[11px]">
                        {metrics.topSources.length > 0 ? (
                          <span className="block truncate">
                            Sumber:{' '}
                            {metrics.topSources.map(s => `${s.source} (${s.count})`).join(', ')}
                          </span>
                        ) : (
                          <span>Belum ada sumber rujukan hari ini</span>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        className={buttonVariants({ size: 'sm', variant: 'outline' })}
                        href={`/dashboard/${tenant.slug}`}
                      >
                        <LayoutDashboard className="mr-1.5 size-3.5" />
                        Dashboard
                      </Link>

                      <Link
                        className={buttonVariants({ size: 'sm', variant: 'outline' })}
                        href={`/dashboard/${tenant.slug}/products`}
                      >
                        <Package className="mr-1.5 size-3.5" />
                        Katalog Produk
                      </Link>

                      <Link
                        className={buttonVariants({ size: 'sm', variant: 'outline' })}
                        href={`/dashboard/${tenant.slug}/settings`}
                      >
                        <Settings className="mr-1.5 size-3.5" />
                        Pengaturan
                      </Link>
                    </div>

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
        </div>
      </main>
    </div>
  )
}
