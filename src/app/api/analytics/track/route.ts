import type { NextRequest } from 'next/server'

import { handleAnalyticsTrack } from '@/features/analytics/server'

export async function POST(request: NextRequest): Promise<Response> {
  return handleAnalyticsTrack(request)
}
