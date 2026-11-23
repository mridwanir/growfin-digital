'use client'

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Globe,
  Loader2,
  MapPin,
  Save,
  Share2,
} from 'lucide-react'
import { useState, useTransition } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateTenantSettingsAction } from '@/lib/dashboard/actions'

export interface TenantSettingsData {
  address: string | null
  brandingContent?: {
    socialLinks?: {
      facebook?: { active?: boolean; url: string }
      instagram?: { active?: boolean; url: string }
      tiktok?: { active?: boolean; url: string }
      whatsapp?: { active?: boolean; url: string }
    }
  } | null
  city: string | null
  customDomain?: string | null
  id: string
  name: string
  packageTier?: string | null
  operatingHours: {
    closeTime?: string
    isOpen?: boolean
    openTime?: string
    raw?: string
  } | null
  phone: string | null
  slug: string
}

export interface SettingsClientProps {
  initialTenant: TenantSettingsData
  tenantId?: string
  tenantSlug?: string
}

export function SettingsClient({ initialTenant, tenantId }: SettingsClientProps) {
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

  const [isPending, startTransition] = useTransition()
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({})

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')
    setFieldErrors({})

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

    startTransition(async () => {
      const res = await updateTenantSettingsAction(tenantId, payload)
      if (!res.success) {
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors)
        }
        setErrorMessage(res.error || 'Gagal menyimpan pengaturan')
        return
      }

      setFieldErrors({})
      setSuccessMessage('Pengaturan toko berhasil disimpan.')
    })
  }

  return (
    <div className="space-y-6">
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
              Detail kontak dan alamat yang ditampilkan di header, footer, dan storefront toko.
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
              {fieldErrors.phone && (
                <p className="text-destructive text-xs">{fieldErrors.phone.join(', ')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Kota / Kabupaten</Label>
              <Input
                id="city"
                placeholder="Jakarta Selatan"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
              {fieldErrors.city && (
                <p className="text-destructive text-xs">{fieldErrors.city.join(', ')}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Input
                id="address"
                placeholder="Jl. Senopati No. 42, Kebayoran Baru"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              {fieldErrors.address && (
                <p className="text-destructive text-xs">{fieldErrors.address.join(', ')}</p>
              )}
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
                className="text-primary focus:ring-primary size-4 rounded border-gray-300"
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
              Tautan akun media sosial toko Anda untuk pengunjung storefront.
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

        {/* Custom Domain */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="text-primary size-5" />
              <CardTitle>Domain Kustom</CardTitle>
            </div>
            <CardDescription>
              Status dan konfigurasi domain kustom untuk storefront toko Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customDomain">Domain Kustom</Label>
              <Input
                readOnly
                className="bg-muted font-mono"
                id="customDomain"
                placeholder="Belum ada domain kustom terhubung"
                value={initialTenant.customDomain || ''}
              />
            </div>

            {initialTenant.customDomain ? (
              <div className="bg-muted/30 space-y-2 rounded-lg border p-4 text-xs">
                <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                  <span>Domain kustom terhubung: {initialTenant.customDomain}</span>
                </div>
                <p className="text-muted-foreground">
                  Konfigurasi DNS: Arahkan CNAME www ke cname.meracik.web atau A record ke IP
                  server. Verifikasi domain diproses secara otomatis.
                </p>
              </div>
            ) : (
              <div className="bg-muted/30 text-muted-foreground space-y-2 rounded-lg border p-4 text-xs">
                <p>
                  Toko Anda saat ini menggunakan subdomain bawaan ({initialTenant.slug}
                  .meracik.web).
                </p>
                <p>
                  Untuk menghubungkan domain kustom seperti tokoanda.com, pastikan paket toko Anda
                  aktif dan hubungi dukungan teknis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button className="min-w-[140px]" disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
