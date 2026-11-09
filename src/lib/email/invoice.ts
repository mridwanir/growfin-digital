import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { userInNeonAuth } from '@/db/schema/auth'
import { resend } from '@/lib/email/resend'
import { env } from '@/lib/env'

export interface InvoiceEmailParams {
  toEmail?: string
  userId?: string | null
  businessName: string
  orderId: string
  paidAt?: Date | string
  amount: number
  packageTier?: string | null
  paymentMethod?: string | null
  slug: string
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: 'currency',
  }).format(amount)
}

function formatTierTitle(tier?: string | null): string {
  switch (tier) {
    case 'instan':
    case 'instant':
      return 'Paket Template Instan (Website Lifetime)'
    case 'pro-basic':
      return 'Paket Pro Basic (Website Lifetime + Domain 1 Thn)'
    case 'pro-advanced':
      return 'Paket Pro Advanced (Full System 1 Thn)'
    case 'enterprise':
      return 'Paket Enterprise Custom'
    default:
      return tier || 'Aktivasi Website'
  }
}

function formatDate(dateValue?: Date | string): string {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : (dateValue ?? new Date())
  return `${date.toLocaleDateString('id-ID', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
  })} WIB`
}

export async function sendInvoiceEmail(params: InvoiceEmailParams) {
  let recipient = params.toEmail

  if (!recipient && params.userId) {
    const [user] = await db
      .select({ email: userInNeonAuth.email })
      .from(userInNeonAuth)
      .where(eq(userInNeonAuth.id, params.userId))

    if (user?.email) {
      recipient = user.email
    }
  }

  if (!recipient) {
    recipient = env.ADMIN_EMAILS.split(',')[0].trim()
  }

  const formattedAmount = formatCurrency(params.amount)
  const tierName = formatTierTitle(params.packageTier)
  const formattedDate = formatDate(params.paidAt)
  const baseDomain = env.NEXT_PUBLIC_BASE_DOMAIN || 'growfin.my.id'
  const siteUrl = `https://${params.slug}.${baseDomain}`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
      <h2 style="color: #059669; margin-bottom: 8px;">Pembayaran Terverifikasi & Website Aktif!</h2>
      <p style="font-size: 15px; line-height: 1.5; color: #444;">Terima kasih atas pembayaran Anda. Website resmi untuk <strong>${params.businessName}</strong> kini telah aktif dan dapat diakses publik.</p>
      
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Order ID</td>
            <td style="padding: 6px 0; font-family: monospace; font-weight: 600; text-align: right;">${params.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Paket Layanan</td>
            <td style="padding: 6px 0; font-weight: 600; text-align: right;">${tierName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Total Bayar</td>
            <td style="padding: 6px 0; font-weight: 700; color: #059669; text-align: right;">${formattedAmount}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Metode Pembayaran</td>
            <td style="padding: 6px 0; text-align: right;">${params.paymentMethod || 'Online Payment'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6b7280;">Waktu Transaksi</td>
            <td style="padding: 6px 0; text-align: right;">${formattedDate}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${siteUrl}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; display: inline-block;">Lihat Website Resmi</a>
      </div>

      <p style="font-size: 12px; color: #9ca3af; text-align: center;">Growfin Digital • Platform Website & Otomasi Digital UMKM</p>
    </div>
  `

  return await resend.emails.send({
    from: env.EMAIL_FROM,
    html,
    subject: `Bukti Pembayaran & Aktivasi Website: ${params.businessName} (#${params.orderId.slice(0, 8)})`,
    to: recipient,
  })
}
