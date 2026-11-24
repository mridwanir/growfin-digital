import type { DailySchedule, OperatingHours as OperatingHoursType, Tenant } from '@/db/schema/auth'
import type { OperatingHoursSectionContent } from '@/db/schema/storefront'

import { cn } from 'cn'
import { Calendar, Clock, MapPin, Phone } from 'lucide-react'

export interface OperatingHoursSectionProps {
  tenant: Tenant
  content?: OperatingHoursSectionContent
  title?: string
  description?: string
  className?: string
}

const DEFAULT_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export function OperatingHours({
  tenant,
  content,
  title = 'Jam Operasional & Lokasi',
  description = 'Kunjungi kami langsung atau hubungi kami pada jam operasional di bawah ini.',
  className,
}: OperatingHoursSectionProps) {
  const operatingHours = (tenant.operatingHours as OperatingHoursType) || {}

  const sectionTitle = content?.title || title
  const sectionDescription = content?.description || description

  const isOpen = content?.isOpen ?? operatingHours.isOpen !== false
  const openTime = content?.openTime || operatingHours.openTime || '08:00'
  const closeTime = content?.closeTime || operatingHours.closeTime || '21:00'
  const defaultHours = content?.raw || operatingHours.raw || `${openTime} - ${closeTime}`

  // Build weekly schedule items
  let schedules: DailySchedule[] = []
  if (Array.isArray(content?.schedules) && content.schedules.length > 0) {
    schedules = content.schedules
  } else if (Array.isArray(operatingHours.schedules) && operatingHours.schedules.length > 0) {
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
      className={cn('w-full py-12 md:py-20', className)}
      data-slot="storefront-operating-hours"
      id="operating-hours"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="text-primary inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
            <Clock className="size-3.5" />
            <span>Waktu Operasional</span>
          </div>
          <h2 className="text-foreground mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="text-muted-foreground mx-auto mt-2 max-w-2xl text-base">
              {sectionDescription}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Weekly Hours Card */}
          <div className="border-border/60 bg-card text-card-foreground rounded-3xl border p-6 shadow-sm sm:p-8 lg:col-span-7">
            <div className="border-border/60 mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl font-bold">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-bold">Jadwal Mingguan</h3>
                  <p className="text-muted-foreground text-xs">Waktu Indonesia Barat (WIB)</p>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className="border-border/60 bg-muted/60 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold"
                data-slot="operational-badge"
              >
                <span className="relative flex size-2">
                  {isOpen && (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={cn(
                      'relative inline-flex size-2 rounded-full',
                      isOpen ? 'bg-emerald-500' : 'bg-rose-500',
                    )}
                  />
                </span>
                <span
                  className={
                    isOpen
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }
                >
                  {isOpen ? 'Buka Sekarang' : 'Sedang Tutup'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {schedules.map(schedule => (
                <div
                  key={schedule.day}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors"
                >
                  <span className="text-foreground font-semibold">{schedule.day}</span>
                  {schedule.closed ? (
                    <span className="text-muted-foreground bg-muted rounded-md px-2 py-0.5 text-xs font-medium">
                      Tutup
                    </span>
                  ) : (
                    <span className="text-foreground font-mono text-xs font-medium sm:text-sm">
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
          <div className="border-border/60 bg-card text-card-foreground flex flex-col justify-between rounded-3xl border p-6 shadow-sm sm:p-8 lg:col-span-5">
            <div className="space-y-6">
              <div className="border-border/60 flex items-center gap-3 border-b pb-6">
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl font-bold">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-bold">Lokasi & Kontak</h3>
                  <p className="text-muted-foreground text-xs">{tenant.name}</p>
                </div>
              </div>

              {address && (
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Alamat Lengkap
                  </span>
                  <p className="text-foreground text-sm leading-relaxed font-medium">
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
                  <p className="text-foreground flex items-center gap-2 text-sm font-semibold">
                    <Phone className="text-muted-foreground size-4" />
                    <span>{phone}</span>
                  </p>
                </div>
              )}
            </div>

            {googleMapsUrl && (
              <div className="pt-6">
                <a
                  className="bg-primary text-primary-foreground inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-xs transition-all hover:opacity-90"
                  href={googleMapsUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <MapPin className="size-4" />
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
