'use client'

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Edit2,
  Filter,
  Image as ImageIcon,
  Loader2,
  Package,
  Plus,
  PlusCircle,
  Save,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { MediaUploader } from '@/components/dashboard/media-uploader'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CategoryItem {
  id: string
  name: string
  slug: string
  sortOrder: number
}

interface VariantOptionItem {
  clientKey?: string
  id?: string
  label: string
  priceModifier: number
  sortOrder?: number
}

interface ProductVariantItem {
  clientKey?: string
  id?: string
  name: string
  options: VariantOptionItem[]
  required?: boolean
}

interface ProductItem {
  basePrice: number
  categoryId: string | null
  description: string | null
  duration?: number | null
  id: string
  imageGallery?: string[] | null
  imageStorageKey?: string | null
  imageUrl?: string | null
  isActive: boolean
  name: string
  originalPrice?: number | null
  sortOrder: number
  stock: number | null
  variants: ProductVariantItem[]
}

interface TenantOption {
  id: string
  name: string
  slug: string
}

interface ProductsClientProps {
  initialCategories: CategoryItem[]
  initialProducts: ProductItem[]
  selectedTenantId: string
  tenants: TenantOption[]
}

export function ProductsClient({
  initialCategories,
  initialProducts,
  selectedTenantId,
  tenants,
}: ProductsClientProps) {
  const router = useRouter()

  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories)
  const [products, setProducts] = useState<ProductItem[]>(initialProducts)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  )
  // Category inline state
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')

  const handleStartEditCategory = (cat: CategoryItem) => {
    setEditingCategoryId(cat.id)
    setEditingCategoryName(cat.name)
  }

  const handleSaveEditCategory = async (catId: string) => {
    if (!editingCategoryName.trim()) return

    try {
      const res = await fetch(`/api/dashboard/tenants/${selectedTenantId}/categories/${catId}`, {
        body: JSON.stringify({ name: editingCategoryName.trim() }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      })
      if (!res.ok) throw new Error('Gagal memperbarui kategori')

      const data = await res.json()
      setCategories(categories.map(c => (c.id === catId ? data.category : c)))
      setEditingCategoryId(null)
      setFeedback({ type: 'success', message: `Kategori berhasil diubah menjadi "${data.category.name}"` })
      router.refresh()
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal memperbarui kategori',
      })
    }
  }

  // Search and Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')

  // Product Form Modal state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)

  // Form Fields
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [basePrice, setBasePrice] = useState<string>('')
  const [originalPrice, setOriginalPrice] = useState<string>('')
  const [stock, setStock] = useState<string>('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [imageUrl, setImageUrl] = useState('')
  const [imageStorageKey, setImageStorageKey] = useState('')
  const [formVariants, setFormVariants] = useState<ProductVariantItem[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTenantChange = (tenantId: string) => {
    router.push(`/dashboard/products?tenant=${tenantId}`)
  }

  // --- Category Actions ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    setIsAddingCategory(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/dashboard/tenants/${selectedTenantId}/categories`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          name: newCategoryName.trim(),
          sortOrder: categories.length,
        }),
      })

      if (!res.ok) throw new Error('Gagal menambahkan kategori')
      const data = await res.json()
      setCategories([...categories, data.category])
      setNewCategoryName('')
      setFeedback({ type: 'success', message: `Kategori "${data.category.name}" berhasil dibuat` })
      router.refresh()
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menambahkan kategori',
      })
    } finally {
      setIsAddingCategory(false)
    }
  }

  const handleDeleteCategory = async (catId: string, catName: string) => {
    try {
      const res = await fetch(`/api/dashboard/tenants/${selectedTenantId}/categories/${catId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Gagal menghapus kategori')

      setCategories(categories.filter(c => c.id !== catId))
      setFeedback({ type: 'success', message: `Kategori "${catName}" berhasil dihapus` })
      router.refresh()
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menghapus kategori',
      })
    }
  }

  // --- Product Form Handlers ---
  const openNewProductForm = () => {
    setEditingProductId(null)
    setName('')
    setCategoryId('')
    setBasePrice('')
    setOriginalPrice('')
    setStock('')
    setDescription('')
    setIsActive(true)
    setImageUrl('')
    setImageStorageKey('')
    setFormVariants([])
    setIsFormOpen(true)
  }

  const openEditProductForm = (prod: ProductItem) => {
    setEditingProductId(prod.id)
    setName(prod.name)
    setCategoryId(prod.categoryId || '')
    setBasePrice(String(prod.basePrice))
    setOriginalPrice(prod.originalPrice ? String(prod.originalPrice) : '')
    setStock(prod.stock !== null && prod.stock !== undefined ? String(prod.stock) : '')
    setDescription(prod.description || '')
    setIsActive(prod.isActive)
    setImageUrl(prod.imageUrl || '')
    setImageStorageKey(prod.imageStorageKey || '')
    setFormVariants(
      prod.variants.map((v, vIdx) => ({
        name: v.name,
        clientKey: v.id || `v-${vIdx}-${Date.now()}`,
        required: v.required ?? false,
        options: v.options.map((o, oIdx) => ({
          clientKey: o.id || `o-${oIdx}-${Date.now()}`,
          label: o.label,
          priceModifier: o.priceModifier,
          sortOrder: o.sortOrder ?? 0,
        })),
      })),
    )
    setIsFormOpen(true)
  }

  const handleAddVariantGroup = () => {
    setFormVariants([
      ...formVariants,
      {
        name: '',
        clientKey: `v-${Date.now()}-${Math.random()}`,
        options: [{ clientKey: `o-${Date.now()}-${Math.random()}`, label: '', priceModifier: 0, sortOrder: 0 }],
        required: false,
      },
    ])
  }

  const handleRemoveVariantGroup = (index: number) => {
    setFormVariants(formVariants.filter((_, idx) => idx !== index))
  }

  const handleUpdateVariantName = (index: number, val: string) => {
    const updated = [...formVariants]
    updated[index].name = val
    setFormVariants(updated)
  }

  const handleUpdateVariantRequired = (index: number, val: boolean) => {
    const updated = [...formVariants]
    updated[index].required = val
    setFormVariants(updated)
  }

  const handleAddVariantOption = (variantIndex: number) => {
    const updated = [...formVariants]
    updated[variantIndex].options.push({
      clientKey: `o-${Date.now()}-${Math.random()}`,
      label: '',
      priceModifier: 0,
      sortOrder: updated[variantIndex].options.length,
    })
    setFormVariants(updated)
  }

  const handleRemoveVariantOption = (variantIndex: number, optionIndex: number) => {
    const updated = [...formVariants]
    updated[variantIndex].options = updated[variantIndex].options.filter(
      (_, idx) => idx !== optionIndex,
    )
    setFormVariants(updated)
  }

  const handleUpdateOptionLabel = (variantIndex: number, optionIndex: number, val: string) => {
    const updated = [...formVariants]
    updated[variantIndex].options[optionIndex].label = val
    setFormVariants(updated)
  }

  const handleUpdateOptionModifier = (variantIndex: number, optionIndex: number, val: string) => {
    const num = Number.parseInt(val, 10)
    const updated = [...formVariants]
    updated[variantIndex].options[optionIndex].priceModifier = Number.isNaN(num) ? 0 : num
    setFormVariants(updated)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Nama produk wajib diisi' })
      return
    }

    const parsedBase = Number.parseInt(basePrice, 10)
    if (Number.isNaN(parsedBase) || parsedBase < 0) {
      setFeedback({ type: 'error', message: 'Harga dasar harus berupa angka non-negatif' })
      return
    }
    const parsedOrig = originalPrice ? Number.parseInt(originalPrice, 10) : null
    const parsedStock = stock ? Number.parseInt(stock, 10) : null

    // Clean valid variants
    const cleanedVariants = formVariants
      .filter(v => v.name.trim().length > 0)
      .map(v => ({
        name: v.name.trim(),
        required: Boolean(v.required),
        options: v.options
          .filter(o => o.label.trim().length > 0)
          .map((o, idx) => ({
            label: o.label.trim(),
            priceModifier: o.priceModifier ?? 0,
            sortOrder: idx,
          })),
      }))
      .filter(v => v.options.length > 0)

    const payload = {
      name: name.trim(),
      basePrice: parsedBase,
      categoryId: categoryId || null,
      description: description.trim() || null,
      imageStorageKey: imageStorageKey.trim() || null,
      imageUrl: imageUrl.trim() || null,
      isActive,
      originalPrice: parsedOrig,
      stock: parsedStock,
      variants: cleanedVariants,
    }

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const url = editingProductId
        ? `/api/dashboard/tenants/${selectedTenantId}/products/${editingProductId}`
        : `/api/dashboard/tenants/${selectedTenantId}/products`
      const method = editingProductId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        method,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.error || 'Gagal menyimpan produk')
      }

      const resData = await res.json()
      if (editingProductId) {
        setProducts(products.map(p => (p.id === editingProductId ? resData.product : p)))
        setFeedback({ type: 'success', message: `Produk "${resData.product.name}" berhasil diperbarui` })
      } else {
        setProducts([resData.product, ...products])
        setFeedback({ type: 'success', message: `Produk "${resData.product.name}" berhasil ditambahkan` })
      }

      setIsFormOpen(false)
      router.refresh()
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menyimpan produk',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (prodId: string, prodName: string) => {
    try {
      const res = await fetch(
        `/api/dashboard/tenants/${selectedTenantId}/products/${prodId}`,
        { method: 'DELETE' },
      )
      if (!res.ok) throw new Error('Gagal menghapus produk')

      setProducts(products.filter(p => p.id !== prodId))
      setFeedback({ type: 'success', message: `Produk "${prodName}" berhasil dihapus` })
      router.refresh()
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menghapus produk',
      })
    }
  }

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategoryFilter === 'all' || p.categoryId === selectedCategoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Multi-Tenant Switcher */}
      {tenants.length > 1 && (
        <Card className="p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Label className="text-sm font-medium" htmlFor="tenant-select">
              Pilih Toko:
            </Label>
            <select
              className="bg-background border-input h-9 rounded-md border px-3 py-1 text-sm shadow-sm focus:outline-none"
              id="tenant-select"
              value={selectedTenantId}
              onChange={e => handleTenantChange(e.target.value)}
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.slug})
                </option>
              ))}
            </select>
          </div>
        </Card>
      )}

      {/* Global Feedback Alert */}
      {feedback && (
        <Alert
          className={
            feedback.type === 'success'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-destructive bg-destructive/10 text-destructive'
          }
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          <AlertTitle className="font-semibold">
            {feedback.type === 'success' ? 'Sukses' : 'Gagal'}
          </AlertTitle>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      )}

      {/* Section 1: Categories Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Tag className="text-primary size-5" />
            <CardTitle>Kategori Produk</CardTitle>
          </div>
          <CardDescription>
            Kelompokkan menu atau produk toko Anda ke dalam kategori (misal: Makanan, Minuman, Pakaian, Aksesoris).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="flex gap-2" onSubmit={handleAddCategory}>
            <Input
              className="max-w-md"
              placeholder="Nama Kategori Baru..."
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
            />
            <Button disabled={isAddingCategory || !newCategoryName.trim()} type="submit">
              {isAddingCategory ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Plus className="mr-2 size-4" />
              )}
              Tambah Kategori
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {categories.length === 0 ? (
              <span className="text-muted-foreground text-sm italic">
                Belum ada kategori. Buat kategori pertama toko Anda di atas.
              </span>
            ) : (
              categories.map(cat => {
                if (editingCategoryId === cat.id) {
                  return (
                    <div
                      key={cat.id}
                      className="bg-background border-primary flex items-center gap-1.5 rounded-lg border px-2 py-1 text-sm shadow-xs"
                    >
                      <Input
                        autoFocus
                        className="h-7 w-32 px-2 text-xs"
                        value={editingCategoryName}
                        onChange={e => setEditingCategoryName(e.target.value)}
                      />
                      <button
                        className="text-primary hover:text-primary/80 p-0.5"
                        title="Simpan Kategori"
                        type="button"
                        onClick={() => handleSaveEditCategory(cat.id)}
                      >
                        <Check className="size-3.5" />
                      </button>
                      <button
                        className="text-muted-foreground hover:text-foreground p-0.5"
                        title="Batal"
                        type="button"
                        onClick={() => setEditingCategoryId(null)}
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  )
                }

                return (
                  <div
                    key={cat.id}
                    className="bg-muted border-border flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
                  >
                    <span className="font-medium">{cat.name}</span>
                    <button
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Nama Kategori"
                      type="button"
                      onClick={() => handleStartEditCategory(cat)}
                    >
                      <Edit2 className="size-3" />
                    </button>
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title="Hapus Kategori"
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Products Catalog List */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight">Katalog Produk</h2>
            <p className="text-muted-foreground text-sm">
              Kelola daftar produk, stok, harga, dan variasi pilihan untuk pembeli.
            </p>
          </div>

          <Button onClick={openNewProductForm}>
            <PlusCircle className="mr-2 size-4" />
            Tambah Produk Baru
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
            <Input
              className="pl-9"
              placeholder="Cari nama produk..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 sm:w-64">
            <Filter className="text-muted-foreground size-4" />
            <select
              className="bg-background border-input h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm focus:outline-none"
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="all">Semua Kategori ({products.length})</option>
              {categories.map(cat => {
                const count = products.filter(p => p.categoryId === cat.id).length
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({count})
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="text-muted-foreground size-12 stroke-1" />
            <h3 className="font-heading mt-4 text-base font-semibold">Tidak Ada Produk</h3>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
              {searchQuery || selectedCategoryFilter !== 'all'
                ? 'Tidak ada produk yang cocok dengan pencarian atau filter kategori Anda.'
                : 'Belum ada produk yang ditambahkan ke toko ini.'}
            </p>
            {(!searchQuery && selectedCategoryFilter === 'all') && (
              <Button className="mt-6" onClick={openNewProductForm}>
                <PlusCircle className="mr-2 size-4" />
                Tambah Produk Pertama
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(prod => {
              const categoryObj = categories.find(c => c.id === prod.categoryId)
              return (
                <Card key={prod.id} className="flex flex-col justify-between overflow-hidden shadow-sm">
                  <div>
                    {prod.imageUrl ? (
                      <div className="relative h-44 w-full bg-muted">
                        <Image
                          fill
                          alt={prod.name}
                          className="object-cover"
                          src={prod.imageUrl}
                        />
                      </div>
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center bg-muted text-muted-foreground">
                        <ImageIcon className="size-8 stroke-1" />
                      </div>
                    )}

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        {categoryObj ? (
                          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {categoryObj.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">Tanpa Kategori</span>
                        )}

                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${prod.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground'
                            }`}
                        >
                          {prod.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>

                      <h4 className="font-heading font-semibold text-base leading-snug line-clamp-1">
                        {prod.name}
                      </h4>

                      {prod.description && (
                        <p className="text-muted-foreground text-xs line-clamp-2">
                          {prod.description}
                        </p>
                      )}

                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="font-bold text-base text-primary">
                          Rp {prod.basePrice.toLocaleString('id-ID')}
                        </span>
                        {prod.originalPrice && prod.originalPrice > prod.basePrice && (
                          <span className="text-muted-foreground text-xs line-through">
                            Rp {prod.originalPrice.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>

                      {/* Variants pill summary */}
                      {prod.variants.length > 0 && (
                        <div className="space-y-1 pt-1 text-xs">
                          <span className="text-muted-foreground text-[11px] font-medium">
                            Varian ({prod.variants.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {prod.variants.map((v, i) => (
                              <span
                                key={`${prod.id}-var-${v.name}-${v.id || i}`}
                                className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px]"
                              >
                                {v.name} ({v.options.length} pilihan)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t p-3 bg-muted/30">
                    <span className="text-muted-foreground text-xs">
                      {prod.stock !== null ? `Stok: ${prod.stock}` : 'Stok tak terbatas'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        title="Edit Produk"
                        variant="ghost"
                        onClick={() => openEditProductForm(prod)}
                      >
                        <Edit2 className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        className="text-destructive hover:bg-destructive/10"
                        size="sm"
                        title="Hapus Produk"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Section 3: Add / Edit Product Modal Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-background border-border my-8 w-full max-w-2xl rounded-xl border p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold">
                  {editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}
                </h3>
                <p className="text-muted-foreground text-xs">
                  Targeted updates disimpan secara aman ke database Postgres tanpa menimpa data toko lain.
                </p>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground"
                type="button"
                onClick={() => setIsFormOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSaveProduct}>
              <div className="space-y-2">
                <Label htmlFor="prodName">Nama Produk *</Label>
                <Input
                  required
                  id="prodName"
                  placeholder="Misal: Kemeja Linen Casual / Kopi Susu Aren"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prodCategory">Kategori</Label>
                  <select
                    className="bg-background border-input h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm focus:outline-none"
                    id="prodCategory"
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prodStock">Stok Barang (Opsional)</Label>
                  <Input
                    id="prodStock"
                    min="0"
                    placeholder="Kosongkan jika selalu tersedia"
                    type="number"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Harga Dasar (IDR) *</Label>
                  <Input
                    required
                    id="basePrice"
                    min="0"
                    placeholder="Contoh: 75000"
                    type="number"
                    value={basePrice}
                    onChange={e => setBasePrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Harga Coret / Asli (IDR)</Label>
                  <Input
                    id="originalPrice"
                    min="0"
                    placeholder="Contoh: 95000"
                    type="number"
                    value={originalPrice}
                    onChange={e => setOriginalPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prodDesc">Deskripsi Produk</Label>
                <textarea
                  className="bg-background border-input w-full rounded-md border p-2 text-sm shadow-sm focus:outline-none"
                  id="prodDesc"
                  placeholder="Deskripsikan keunggulan, bahan, atau porsi produk Anda..."
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  checked={isActive}
                  className="size-4 rounded border-gray-300 text-primary"
                  id="isActiveToggle"
                  type="checkbox"
                  onChange={e => setIsActive(e.target.checked)}
                />
                <Label className="cursor-pointer text-sm font-medium" htmlFor="isActiveToggle">
                  Produk Aktif (Tampilkan di Etalase Storefront)
                </Label>
              </div>

              {/* Media Uploader */}
              <div className="space-y-2 rounded-lg border p-4 bg-muted/20">
                <Label className="text-sm font-semibold">Foto Produk</Label>
                <MediaUploader
                  currentImageUrl={imageUrl}
                  folder="products"
                  label="Upload Foto Produk (Neon S3)"
                  onUploadSuccess={(url, key) => {
                    setImageUrl(url)
                    setImageStorageKey(key)
                  }}
                />
                {imageUrl && (
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate max-w-sm">{imageUrl}</span>
                    <button
                      className="text-destructive hover:underline ml-2"
                      type="button"
                      onClick={() => {
                        setImageUrl('')
                        setImageStorageKey('')
                      }}
                    >
                      Hapus Foto
                    </button>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* VARIANT BUILDER INTERFACE                                  */}
              {/* ========================================================= */}
              <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-semibold text-sm">
                      Variant Builder (Pilihan Varian)
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      Tambahkan variasi seperti Ukuran, Rasa, atau Warna dengan modifier harga (+ / -).
                    </p>
                  </div>

                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={handleAddVariantGroup}
                  >
                    <Plus className="mr-1.5 size-3.5" />
                    Tambah Varian
                  </Button>
                </div>

                {formVariants.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                    Belum ada kelompok varian untuk produk ini. Klik &quot;Tambah Varian&quot; jika produk memiliki ukuran atau opsi.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formVariants.map((variant, vIdx) => (
                      <div
                        key={variant.clientKey || `var-${vIdx}`}
                        className="bg-background rounded-lg border p-4 space-y-3 shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            <Label className="text-xs font-semibold">Nama Varian (misal: Ukuran / Warna)</Label>
                            <Input
                              className="h-8 text-sm"
                              placeholder="Contoh: Ukuran, Warna, Es Batu"
                              value={variant.name}
                              onChange={e => handleUpdateVariantName(vIdx, e.target.value)}
                            />
                          </div>

                          <button
                            className="text-destructive hover:text-destructive/80 self-end pb-1"
                            title="Hapus Kelompok Varian"
                            type="button"
                            onClick={() => handleRemoveVariantGroup(vIdx)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            checked={variant.required}
                            className="size-3.5 rounded border-gray-300 text-primary"
                            id={`req-${vIdx}`}
                            type="checkbox"
                            onChange={e => handleUpdateVariantRequired(vIdx, e.target.checked)}
                          />
                          <Label className="cursor-pointer text-xs" htmlFor={`req-${vIdx}`}>
                            Wajib Dipilih oleh Pembeli
                          </Label>
                        </div>

                        {/* Options list inside variant */}
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Opsi Pilihan Varian</span>
                            <span>Modifier Harga (IDR)</span>
                          </div>

                          {variant.options.map((opt, oIdx) => (
                            <div key={opt.clientKey || `opt-${oIdx}`} className="flex items-center gap-2">
                              <Input
                                className="h-8 text-xs flex-1"
                                placeholder="Misal: Regular / XL"
                                value={opt.label}
                                onChange={e => handleUpdateOptionLabel(vIdx, oIdx, e.target.value)}
                              />

                              <div className="relative w-36">
                                <span className="absolute left-2.5 top-2 text-[11px] text-muted-foreground">
                                  Rp
                                </span>
                                <Input
                                  className="h-8 pl-8 text-xs"
                                  placeholder="0"
                                  type="number"
                                  value={opt.priceModifier}
                                  onChange={e => handleUpdateOptionModifier(vIdx, oIdx, e.target.value)}
                                />
                              </div>

                              <button
                                className="text-muted-foreground hover:text-destructive"
                                type="button"
                                onClick={() => handleRemoveVariantOption(vIdx, oIdx)}
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          ))}

                          <Button
                            className="text-xs h-7 mt-1 text-primary"
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => handleAddVariantOption(vIdx)}
                          >
                            <Plus className="mr-1 size-3" />
                            Tambah Opsi Pilihan
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  disabled={isSubmitting}
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Batal
                </Button>
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      {editingProductId ? 'Simpan Perubahan' : 'Buat Produk'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
