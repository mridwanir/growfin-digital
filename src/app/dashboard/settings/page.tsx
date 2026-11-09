import { Store } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getSession } from '@/lib/auth/server'
import { getMerchantTenants, getTenantSettings } from '@/lib/dashboard/mutations'

import { SettingsClient } from './settings-client'

interface SettingsPageProps {
  searchParams: Promise<{ tenant?: string }>
}

async function SettingsContent({ searchParams }: SettingsPageProps) {
  const { data: session } = await getSession()
  if (!session?.user?.id) return null

  const tenantList = await getMerchantTenants(session.user.id)
  if (tenantList.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <Store className="text-muted-foreground size-12 stroke-1" />
        <h3 className="font-heading mt-4 text-base font-semibold">Belum Ada Toko</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Anda perlu memiliki setidaknya satu toko untuk mengubah pengaturan bisnis.
        </p>
        <Link className={buttonVariants({ className: 'mt-6' })} href="/">
          Buat Toko Baru
        </Link>
      </Card>
    )
  }

  const { tenant: selectedTenantId } = await searchParams
  const activeTenantMeta =
    tenantList.find(t => t.id === selectedTenantId) || tenantList[0]

  const fullSettings = await getTenantSettings(activeTenantMeta.id, session.user.id)
  if (!fullSettings) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Pengaturan Toko: {fullSettings.name}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Perbarui kontak usaha, jam operasional, dan tautan sosial media toko Anda.
        </p>
      </div>

      <SettingsClient
        initialTenant={fullSettings}
        tenants={tenantList.map(t => ({ id: t.id, name: t.name, slug: t.slug }))}
      />
    </div>
  )
}

export default function SettingsPage({ searchParams }: SettingsPageProps) {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Suspense
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        }
      >
        <SettingsContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
