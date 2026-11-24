import type { InvoiceEmailParams } from './types'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { userInNeonAuth } from '@/db/schema/auth'
import { formatCurrency } from '@/features/storefront'
import { resend } from '@/lib/email/resend'
import { env } from '@/lib/env'

import 'server-only'

function formatTierTitle(tier?: string | null): string {
  switch (tier) {
    case 'instant':
      return 'Paket Instan'
    case 'pro':
      return 'Paket Pro'
    case 'pro_custom':
      return 'Paket Pro Custom'
    case 'enterprise':
      return 'Paket Enterprise'
    default:
      return 'Langganan Website Growfin'
  }
}

function formatDate(dateValue?: Date | string): string {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : (dateValue ?? new Date())
  return `${date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
  })}, ${date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })} WIB`
}

export async function sendInvoiceEmail(params: InvoiceEmailParams) {
  let recipient = params.toEmail

  if (!recipient && params.userId) {
    try {
      const [u] = await db
        .select({ email: userInNeonAuth.email })
        .from(userInNeonAuth)
        .where(eq(userInNeonAuth.id, params.userId))
      if (u?.email) {
        recipient = u.email
      }
    } catch (err) {
      console.warn('[Invoice Email] Could not resolve user email from Neon auth table:', err)
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
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a; margin-top: 0;">Pembayaran Berhasil & Website Aktif! 🎉</h2>
      <p style="color: #475569; font-size: 16px; line-height: 24px;">
        Halo Merchant <strong>${params.businessName}</strong>, pembayaran untuk aktivasi website Anda telah berhasil kami terima.
      </p>
      
      <div style="background-color: #f8fafc; border-radius: 6px; padding: 16px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
          <tr>
            <td style="padding: 8px 0; color: #64748b;">No. Transaksi / Order ID:</td>
            <td style="padding: 8px 0; font-weight: bold; text-align: right;">${params.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Paket Langganan:</td>
            <td style="padding: 8px 0; font-weight: bold; text-align: right;">${tierName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Metode Pembayaran:</td>
            <td style="padding: 8px 0; font-weight: bold; text-align: right;">${params.paymentMethod || 'Online Payment'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Tanggal Pembayaran:</td>
            <td style="padding: 8px 0; font-weight: bold; text-align: right;">${formattedDate}</td>
          </tr>
          <tr style="border-top: 1px solid #cbd5e1;">
            <td style="padding: 12px 0 4px 0; font-size: 16px; font-weight: bold; color: #0f172a;">Total Dibayar:</td>
            <td style="padding: 12px 0 4px 0; font-size: 16px; font-weight: bold; color: #0284c7; text-align: right;">${formattedAmount}</td>
          </tr>
        </table>
      </div>

      <div style="margin: 24px 0; text-align: center;">
        <a href="${siteUrl}" style="background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Kunjungi Website Publik Anda
        </a>
      </div>

      <p style="color: #64748b; font-size: 13px; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        Jika Anda memiliki pertanyaan seputar aktivasi atau domain khusus, silakan hubungi tim kami via WhatsApp atau balas email ini.
      </p>
    </div>
  `

  return await resend.emails.send({
    from: 'MeracikWeb Billing <noreply@growfin.my.id>',
    html,
    subject: `[Lunas] Bukti Pembayaran Website ${params.businessName} (${params.orderId})`,
    to: recipient,
  })
}
