import { requireActiveTenantContext } from '@/features/auth/server'
import { ProductsClient } from '@/features/dashboard'
import { getTenantCategories, getTenantProducts } from '@/features/dashboard/server'

export default async function TenantProductsPage() {
  const { currentTenant: tenant, session } = await requireActiveTenantContext()

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
        tenantSlug={tenant.slug}
      />
    </div>
  )
}
