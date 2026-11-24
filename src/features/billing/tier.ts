import type { PackageTier } from '@/db/schema/tenants'

export function normalizePackageTier(tier?: string | null): PackageTier {
  if (!tier) return 'instant'
  if (tier === 'pro' || tier.startsWith('pro') || tier === 'enterprise') return 'pro'
  if (tier === 'instant' || tier === 'instan') return 'instant'
  if (tier === 'free' || tier === 'free_trial') return 'free'
  return 'instant'
}
