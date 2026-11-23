import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/server'
import { getTenantBySlug, getTenantSettings } from '@/lib/dashboard/mutations'

import { SettingsClient } from './settings-client'

interface TenantSettingsPageProps {
  params: Promise<{ tenantSlug: string }>
}

export default async function TenantSettingsPage({ params }: TenantSettingsPageProps) {
  const { data: session } = await getSession()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const { tenantSlug } = await params
  const tenant = await getTenantBySlug(tenantSlug, session.user.id)

  if (!tenant) {
    redirect('/dashboard')
  }

  const fullSettings = await getTenantSettings(tenant.id, session.user.id)

  if (!fullSettings) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Pengaturan Toko: {fullSettings.name}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Perbarui kontak usaha, jam operasional, tautan sosial media, dan domain kustom toko Anda.
        </p>
      </div>

      <SettingsClient initialTenant={fullSettings} tenantId={tenant.id} tenantSlug={tenantSlug} />
    </div>
  )
}
