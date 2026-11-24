import { notFound } from 'next/navigation'

import { StorefrontEditor } from '@/components/dashboard/editor'
import { requireActiveTenantContext } from '@/features/auth/server'
import { getStorefrontDraftDataBySlug } from '@/lib/storefront/loader'
import { serializeRecord } from '@/lib/storefront/serialization'

export default async function StorefrontEditorPage() {
  const { currentTenant } = await requireActiveTenantContext()

  const draftData = await getStorefrontDraftDataBySlug(currentTenant.slug)

  if (!draftData) {
    notFound()
  }

  const { config, tenant } = draftData

  return (
    <div className="-m-4 flex h-[calc(100vh-4rem)] flex-col overflow-hidden md:-m-6">
      <StorefrontEditor.Root
        className="flex h-full flex-col"
        initialConfig={serializeRecord(config)}
        tenant={serializeRecord(tenant)}
      >
        <StorefrontEditor.Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <StorefrontEditor.Sidebar />
          <StorefrontEditor.Canvas />
          <StorefrontEditor.Inspector />
        </div>
      </StorefrontEditor.Root>
    </div>
  )
}
