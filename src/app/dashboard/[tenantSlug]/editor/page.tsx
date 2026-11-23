import { notFound, redirect } from 'next/navigation'

import { StorefrontEditor } from '@/components/dashboard/editor'
import { getSession } from '@/lib/auth/server'
import { getTenantBySlug } from '@/lib/dashboard/mutations'
import { getStorefrontDraftDataBySlug } from '@/lib/storefront/loader'
import { serializeRecord } from '@/lib/storefront/serialization'

interface EditorPageProps {
  params: Promise<{ tenantSlug: string }>
}

export default async function StorefrontEditorPage({ params }: EditorPageProps) {
  const { data: session } = await getSession()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const { tenantSlug } = await params
  const currentTenant = await getTenantBySlug(tenantSlug, session.user.id)

  if (!currentTenant) {
    redirect('/dashboard')
  }

  const draftData = await getStorefrontDraftDataBySlug(tenantSlug)

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
