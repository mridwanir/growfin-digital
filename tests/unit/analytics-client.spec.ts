import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { trackEvent } from '@/lib/analytics'

describe('Analytics client utilities (trackEvent)', () => {
  const originalFetch = globalThis.fetch
  const originalWindow = (globalThis as unknown as { window?: unknown }).window

  beforeEach(() => {
    vi.restoreAllMocks()
    ;(globalThis as unknown as { window: unknown }).window = {
      location: {
        pathname: '/site/test-slug',
        search: '',
      },
    }
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    ;(globalThis as unknown as { window: unknown }).window = originalWindow
  })

  it('extracts slug from /site/<slug> path and ignores other paths', () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    globalThis.fetch = fetchMock
    ;(
      globalThis as unknown as { window: { location: { pathname: string; search: string } } }
    ).window.location = {
      pathname: '/other/path',
      search: '',
    }

    trackEvent('page_view')
    expect(fetchMock).not.toHaveBeenCalled()
    ;(
      globalThis as unknown as { window: { location: { pathname: string; search: string } } }
    ).window.location = {
      pathname: '/site/my-cool-store',
      search: '',
    }

    trackEvent('page_view')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).slug).toBe('my-cool-store')
  })

  it('fires a POST request to /api/analytics/track with slug, event, and metadata', () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    globalThis.fetch = fetchMock

    trackEvent('page_view', { key: 'value' })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/analytics/track')
    expect(options.method).toBe('POST')
    expect(options.keepalive).toBe(true)
    expect(JSON.parse(options.body)).toEqual({
      event: 'page_view',
      metadata: { key: 'value' },
      slug: 'test-slug',
    })
  })

  it('forwards UTM params as query parameters on page_view event', () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    globalThis.fetch = fetchMock
    ;(
      globalThis as unknown as { window: { location: { pathname: string; search: string } } }
    ).window.location = {
      pathname: '/site/test-slug',
      search: '?utm_source=twitter&utm_medium=social&utm_campaign=launch&other=ignore',
    }

    trackEvent('page_view')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url] = fetchMock.mock.calls[0]
    expect(url).toContain('utm_source=twitter')
    expect(url).toContain('utm_medium=social')
    expect(url).toContain('utm_campaign=launch')
    expect(url).not.toContain('other=ignore')
  })

  it('does not append UTM query parameters for non-page_view events', () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    globalThis.fetch = fetchMock
    ;(
      globalThis as unknown as { window: { location: { pathname: string; search: string } } }
    ).window.location = {
      pathname: '/site/test-slug',
      search: '?utm_source=twitter',
    }

    trackEvent('checkout_start')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/analytics/track')
  })

  it('silently catches network errors without throwing', () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'))
    globalThis.fetch = fetchMock

    expect(() => {
      trackEvent('checkout_complete')
    }).not.toThrow()
  })
})
