import type { Tenant, OperatingHours as OperatingHoursType, DailySchedule } from '@/db/schema/tenants'

import { cn } from 'cn'
import { Calendar, Clock, MapPin, Phone } from 'lucide-react'

export interface OperatingHoursSectionProps {
  tenant: Tenant
  title?: string
  description?: string
  className?: string
}

const DEFAULT_DAYS = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu',
]

export function OperatingHours({
  tenant,
  title = 'Jam Operasional & Lokasi',
  description = 'Kunjungi kami langsung atau hubungi kami pada jam operasional di bawah ini.',
  className,
}: OperatingHoursSectionProps) {
  const operatingHours = (tenant.operatingHours as OperatingHoursType) || {}

  const isOpen = operatingHours.isOpen !== false
  const openTime = operatingHours.openTime || '08:00'
  const closeTime = operatingHours.closeTime || '21:00'
  const defaultHours = operatingHours.raw || `${openTime} - ${closeTime}`

  // Build weekly schedule items
  let schedules: DailySchedule[] = []
  if (Array.isArray(operatingHours.schedules) && operatingHours.schedules.length > 0) {
    schedules = operatingHours.schedules
  } else {
    schedules = DEFAULT_DAYS.map(day => ({
      close: closeTime,
      closed: false,
      day,
      open: openTime,
    }))
  }

  const address = tenant.address || null
  const city = tenant.city || null
  const phone = tenant.phone || null
  const googleMapsUrl = tenant.googleMapsUrl || null

  return (
    <section
      id="operating-hours"
      className={cn('w-full py-12 md:py-20', className)}
      data-slot="storefront-operating-hours"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="text-primary inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
            <Clock className="h-3.5 w-3.5" />
            <span>Waktu Operasional</span>
          </div>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground mx-auto mt-2 max-w-2xl text-base">
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Weekly Hours Card */}
          <div className="border-border/60 bg-card text-card-foreground rounded-3xl border p-6 shadow-sm lg:col-span-7 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl font-bold">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Jadwal Mingguan</h3>
                  <p className="text-muted-foreground text-xs">Waktu Indonesia Barat (WIB)</p>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-3.5 py-1.5 text-xs font-bold"
                data-slot="operational-badge"
              >
                <span className="relative flex h-2 w-2">
                  {isOpen && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={cn(
                      'relative inline-flex h-2 w-2 rounded-full',
                      isOpen ? 'bg-emerald-500' : 'bg-rose-500',
                    )}
                  />
                </span>
                <span className={isOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                  {isOpen ? 'Buka Sekarang' : 'Sedang Tutup'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {schedules.map((schedule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="font-semibold text-foreground">{schedule.day}</span>
                  {schedule.closed ? (
                    <span className="text-muted-foreground rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                      Tutup
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-medium text-foreground sm:text-sm">
                      {schedule.open && schedule.close
                        ? `${schedule.open} - ${schedule.close}`
                        : defaultHours}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Location & Contact Info Card */}
          <div className="border-border/60 bg-card text-card-foreground flex flex-col justify-between rounded-3xl border p-6 shadow-sm lg:col-span-5 sm:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-border/60 pb-6">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl font-bold">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Lokasi & Kontak</h3>
                  <p className="text-muted-foreground text-xs">{tenant.name}</p>
                </div>
              </div>

              {address && (
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Alamat Lengkap
                  </span>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {address}
                    {city ? `, ${city}` : ''}
                  </p>
                </div>
              )}

              {phone && (
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Nomor Telepon
                  </span>
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{phone}</span>
                  </p>
                </div>
              )}
            </div>

            {googleMapsUrl && (
              <div className="pt-6">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-primary-foreground hover:opacity-90 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-xs transition-all"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Buka di Google Maps</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
