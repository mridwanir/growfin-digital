import { Store } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getSession } from '@/lib/auth/server'
import {
  getMerchantTenants,
  getTenantCategories,
  getTenantProducts,
} from '@/lib/dashboard/mutations'

import { ProductsClient } from './products-client'

interface ProductsPageProps {
  searchParams: Promise<{ tenant?: string }>
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const { data: session } = await getSession()
  if (!session?.user?.id) return null

  const tenantList = await getMerchantTenants(session.user.id)
  if (tenantList.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <Store className="text-muted-foreground size-12 stroke-1" />
        <h3 className="font-heading mt-4 text-base font-semibold">Belum Ada Toko</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Anda perlu memiliki setidaknya satu website toko untuk mengelola katalog produk.
        </p>
        <Link className={buttonVariants({ className: 'mt-6' })} href="/">
          Buat Toko Baru
        </Link>
      </Card>
    )
  }

  const { tenant: selectedTenantId } = await searchParams
  const activeTenant =
    tenantList.find(t => t.id === selectedTenantId) || tenantList[0]

  const [categories, products] = await Promise.all([
    getTenantCategories(activeTenant.id, session.user.id),
    getTenantProducts(activeTenant.id, session.user.id),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Katalog Produk: {activeTenant.name}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Kelola kategori, daftar menu, variasi harga, dan stok barang untuk storefront Anda.
        </p>
      </div>

      <ProductsClient
        initialCategories={categories || []}
        initialProducts={products || []}
        selectedTenantId={activeTenant.id}
        tenants={tenantList.map(t => ({ id: t.id, name: t.name, slug: t.slug }))}
      />
    </div>
  )
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <main className="container mx-auto px-4 py-8 sm:px-6">
      <Suspense
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
        }
      >
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
