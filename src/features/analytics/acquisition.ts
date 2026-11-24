import type { NextRequest } from 'next/server'

import type { Acquisition } from './types'

import 'server-only'

export function parseAcquisition(request: NextRequest, event: string): Acquisition | null {
  if (event !== 'page_view') {
    return null
  }

  const referer = request.headers.get('referer') || request.headers.get('referrer')
  const url = request.nextUrl || new URL(request.url)
  const utmSource = url.searchParams.get('utm_source')
  const utmMedium = url.searchParams.get('utm_medium')
  const utmCampaign = url.searchParams.get('utm_campaign')

  let externalReferrer: string | null = null
  let referrerSource: string | null = null

  if (referer) {
    try {
      const parsedReferer = new URL(referer)
      const currentHost = url.host || request.headers.get('host') || ''
      if (parsedReferer.host !== currentHost) {
        externalReferrer = referer
        referrerSource = parsedReferer.hostname.replace(/^www\./, '')
      }
    } catch {
      externalReferrer = referer
      referrerSource = referer
    }
  }

  if (!externalReferrer && !utmSource && !utmMedium && !utmCampaign) {
    return null
  }

  const acquisition: Acquisition = {}

  if (utmSource) {
    acquisition.source = utmSource
  } else if (referrerSource) {
    acquisition.source = referrerSource
  }

  if (utmMedium) {
    acquisition.medium = utmMedium
  }
  if (utmCampaign) {
    acquisition.campaign = utmCampaign
  }
  if (externalReferrer) {
    acquisition.referrer = externalReferrer
  }

  return Object.keys(acquisition).length > 0 ? acquisition : null
}
