'use client'

import { AlertCircle, CheckCircle2, Clock, Loader2, MapPin, Save, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TenantOption {
  id: string
  name: string
  slug: string
}

interface TenantSettingsData {
  address: string | null
  brandingContent: {
    socialLinks?: {
      facebook?: { active?: boolean; url: string }
      instagram?: { active?: boolean; url: string }
      tiktok?: { active?: boolean; url: string }
      whatsapp?: { active?: boolean; url: string }
    }
  } | null
  city: string | null
  id: string
  name: string
  operatingHours: {
    closeTime?: string
    isOpen?: boolean
    openTime?: string
    raw?: string
  } | null
  phone: string | null
  slug: string
}

interface SettingsClientProps {
  initialTenant: TenantSettingsData
  tenants: TenantOption[]
}

export function SettingsClient({ initialTenant, tenants }: SettingsClientProps) {
  const router = useRouter()
  const [selectedTenantId, setSelectedTenantId] = useState(initialTenant.id)

  const [phone, setPhone] = useState(initialTenant.phone || '')
  const [city, setCity] = useState(initialTenant.city || '')
  const [address, setAddress] = useState(initialTenant.address || '')

  const [openTime, setOpenTime] = useState(initialTenant.operatingHours?.openTime || '08:00')
  const [closeTime, setCloseTime] = useState(initialTenant.operatingHours?.closeTime || '21:00')
  const [hoursRaw, setHoursRaw] = useState(initialTenant.operatingHours?.raw || '')
  const [isOpen, setIsOpen] = useState(initialTenant.operatingHours?.isOpen ?? true)

  const social = initialTenant.brandingContent?.socialLinks || {}
  const [whatsapp, setWhatsapp] = useState(social.whatsapp?.url || '')
  const [instagram, setInstagram] = useState(social.instagram?.url || '')
  const [tiktok, setTiktok] = useState(social.tiktok?.url || '')
  const [facebook, setFacebook] = useState(social.facebook?.url || '')

  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleTenantChange = (tenantId: string) => {
    setSelectedTenantId(tenantId)
    router.push(`/dashboard/settings?tenant=${tenantId}`)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const payload = {
        address: address.trim() || null,
        city: city.trim() || null,
        phone: phone.trim() || null,
        operatingHours: {
          closeTime,
          isOpen,
          openTime,
          raw: hoursRaw.trim() || `${openTime} - ${closeTime}`,
        },
        socialLinks: {
          facebook: { active: Boolean(facebook.trim()), url: facebook.trim() },
          instagram: { active: Boolean(instagram.trim()), url: instagram.trim() },
          tiktok: { active: Boolean(tiktok.trim()), url: tiktok.trim() },
          whatsapp: { active: Boolean(whatsapp.trim()), url: whatsapp.trim() },
        },
      }

      const res = await fetch(`/api/dashboard/tenants/${selectedTenantId}/settings`, {
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.error || 'Gagal menyimpan pengaturan')
      }

      setSuccessMessage('Pengaturan toko berhasil disimpan!')
      router.refresh()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {tenants.length > 1 && (
        <Card className="p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Label className="text-sm font-medium" htmlFor="tenant-select">
              Pilih Toko:
            </Label>
            <select
              className="bg-background border-input ring-offset-background h-9 rounded-md border px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1"
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

      {successMessage && (
        <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          <AlertTitle className="font-semibold">Sukses</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle className="font-semibold">Gagal</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form className="space-y-6" onSubmit={handleSave}>
        {/* Contact & Location */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="text-primary size-5" />
              <CardTitle>Kontak & Lokasi Usaha</CardTitle>
            </div>
            <CardDescription>
              Detail kontak dan alamat yang ditampilkan di header, footer, dan peta storefront toko.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon / WhatsApp</Label>
              <Input
                id="phone"
                placeholder="08123456789"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Kota / Kabupaten</Label>
              <Input
                id="city"
                placeholder="Jakarta Selatan"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Input
                id="address"
                placeholder="Jl. Senopati No. 42, Kebayoran Baru"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="text-primary size-5" />
              <CardTitle>Jam Operasional</CardTitle>
            </div>
            <CardDescription>
              Jadwal buka dan tutup toko untuk pengunjung dan pesanan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="openTime">Jam Buka</Label>
                <Input
                  id="openTime"
                  type="time"
                  value={openTime}
                  onChange={e => setOpenTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closeTime">Jam Tutup</Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={closeTime}
                  onChange={e => setCloseTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoursRaw">Teks Jadwal Lengkap</Label>
              <Input
                id="hoursRaw"
                placeholder="Senin - Minggu: 08:00 - 21:00"
                value={hoursRaw}
                onChange={e => setHoursRaw(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                checked={isOpen}
                className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                id="isOpenToggle"
                type="checkbox"
                onChange={e => setIsOpen(e.target.checked)}
              />
              <Label className="cursor-pointer text-sm font-medium" htmlFor="isOpenToggle">
                Toko Sedang Buka (Terima Pesanan)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Share2 className="text-primary size-5" />
              <CardTitle>Media Sosial & WhatsApp</CardTitle>
            </div>
            <CardDescription>
              Tautan akun media sosial toko Anda yang dapat diklik oleh pengunjung storefront.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="waLink">WhatsApp Direct URL / Phone</Label>
              <Input
                id="waLink"
                placeholder="https://wa.me/6281234567890"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="igLink">Instagram Profile URL</Label>
              <Input
                id="igLink"
                placeholder="https://instagram.com/namatoko"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktokLink">TikTok Profile URL</Label>
              <Input
                id="tiktokLink"
                placeholder="https://tiktok.com/@namatoko"
                value={tiktok}
                onChange={e => setTiktok(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fbLink">Facebook Page URL</Label>
              <Input
                id="fbLink"
                placeholder="https://facebook.com/namatoko"
                value={facebook}
                onChange={e => setFacebook(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button className="min-w-32" disabled={isSaving} type="submit">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Simpan Pengaturan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
