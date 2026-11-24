import crypto from 'node:crypto'

import { env } from '@/lib/env'

import 'server-only'

export function computeVisitorHash(ip: string, userAgent: string, tenantId: string): string {
  const dateStr = new Date().toISOString().slice(0, 10)
  const dailySalt = crypto
    .createHmac('sha256', env.ANALYTICS_HASH_SECRET)
    .update(dateStr)
    .digest('hex')
  return crypto
    .createHash('sha256')
    .update(`${ip}${userAgent}${tenantId}${dailySalt}`)
    .digest('hex')
}
