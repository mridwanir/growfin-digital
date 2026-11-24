import { redirect } from 'next/navigation'

import { requireActiveTenantContext } from '@/features/auth/server'
import { SettingsClient } from '@/features/dashboard'
import { getTenantSettings } from '@/features/dashboard/server'

export default async function TenantSettingsPage() {
  const { currentTenant: tenant, session } = await requireActiveTenantContext()

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

      <SettingsClient initialTenant={fullSettings} tenantId={tenant.id} tenantSlug={tenant.slug} />
    </div>
  )
}
