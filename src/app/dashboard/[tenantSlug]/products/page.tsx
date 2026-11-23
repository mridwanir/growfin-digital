import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/server'
import { getTenantBySlug, getTenantCategories, getTenantProducts } from '@/lib/dashboard/mutations'

import { ProductsClient } from './products-client'

interface TenantProductsPageProps {
  params: Promise<{ tenantSlug: string }>
}

export default async function TenantProductsPage({ params }: TenantProductsPageProps) {
  const { data: session } = await getSession()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const { tenantSlug } = await params
  const tenant = await getTenantBySlug(tenantSlug, session.user.id)

  if (!tenant) {
    redirect('/dashboard')
  }

  const [categories, products] = await Promise.all([
    getTenantCategories(tenant.id, session.user.id),
    getTenantProducts(tenant.id, session.user.id),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Katalog Produk: {tenant.name}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Kelola kategori, daftar menu, variasi harga, dan stok barang untuk storefront Anda.
        </p>
      </div>

      <ProductsClient
        initialCategories={categories || []}
        initialProducts={products || []}
        tenantId={tenant.id}
        tenantSlug={tenantSlug}
      />
    </div>
  )
}
