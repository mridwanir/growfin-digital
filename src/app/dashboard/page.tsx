import { ExternalLink, Package, Palette, Settings } from 'lucide-react'
import Link from 'next/link'

import { TenantStatusBadge, TenantTierBadge } from '@/components/dashboard/tenant-badges'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requireActiveTenantContext } from '@/features/auth/server'
import { getTenantAnalyticsMetrics } from '@/lib/dashboard/analytics'
import { env } from '@/lib/env'

export default async function DashboardPage() {
  const { currentTenant: tenant, session } = await requireActiveTenantContext()

  const metrics = await getTenantAnalyticsMetrics(tenant.id, session.user.id)
  const analytics = metrics ?? {
    checkoutCompletes: 0,
    checkoutStarts: 0,
    conversionRate: 0,
    pageViews: 0,
    topSources: [],
    uniqueVisitors: 0,
  }

  const baseDomain = env.NEXT_PUBLIC_BASE_DOMAIN
  const liveUrl =
    tenant.status === 'published' ? `https://${tenant.slug}.${baseDomain}` : `/demo/${tenant.slug}`

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">{tenant.name}</h1>
            <TenantStatusBadge status={tenant.status} />
            <TenantTierBadge tier={tenant.packageTier} />
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Ringkasan performa harian dan akses cepat pengelolaan toko.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            className={buttonVariants({ size: 'sm', variant: 'outline' })}
            href="/dashboard/products"
          >
            <Package className="mr-1.5 size-4" />
            Katalog Produk
          </Link>
          <Link
            className={buttonVariants({ size: 'sm', variant: 'outline' })}
            href="/dashboard/settings"
          >
            <Settings className="mr-1.5 size-4" />
            Pengaturan
          </Link>
          <Link
            className={buttonVariants({ size: 'sm', variant: 'outline' })}
            href="/dashboard/editor"
          >
            <Palette className="mr-1.5 size-4" />
            Editor Storefront
          </Link>
          <Link
            className={buttonVariants({ size: 'sm' })}
            href={liveUrl}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="mr-1.5 size-4" />
            Buka Website
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tayangan Hari Ini</CardDescription>
            <CardTitle className="text-2xl font-bold">{analytics.pageViews}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Total kunjungan halaman storefront</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pengunjung Unik</CardDescription>
            <CardTitle className="text-2xl font-bold">{analytics.uniqueVisitors}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Pengunjung teridentifikasi berbeda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Mulai Checkout</CardDescription>
            <CardTitle className="text-2xl font-bold">{analytics.checkoutStarts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              {analytics.checkoutCompletes} transaksi selesai
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tingkat Konversi</CardDescription>
            <CardTitle className="text-2xl font-bold">{analytics.conversionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Rasio penyelesaian dari checkout</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Profil Toko</CardTitle>
            <CardDescription>Informasi ringkas usaha dan alamat storefront</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Kategori</span>
              <span className="font-medium">{tenant.category}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Domain Slug</span>
              <span className="font-mono text-xs">{tenant.slug}</span>
            </div>
            {tenant.customDomain && (
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Custom Domain</span>
                <span className="text-primary font-mono text-xs">{tenant.customDomain}</span>
              </div>
            )}
            {tenant.city && (
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Kota</span>
                <span>{tenant.city}</span>
              </div>
            )}
            {tenant.phone && (
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Telepon / WhatsApp</span>
                <span>{tenant.phone}</span>
              </div>
            )}
            {tenant.address && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Alamat</span>
                <span className="max-w-[200px] truncate text-right">{tenant.address}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Sumber Rujukan Teratas</CardTitle>
            <CardDescription>Kanal akuisisi pengunjung hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topSources.length > 0 ? (
              <div className="space-y-3">
                {analytics.topSources.map(source => (
                  <div
                    key={source.source}
                    className="flex items-center justify-between border-b pb-2 text-sm last:border-0 last:pb-0"
                  >
                    <span className="font-medium">{source.source}</span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {source.count} kunjungan
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-6 text-center text-sm">
                <p>Belum ada sumber rujukan tercatat hari ini.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
