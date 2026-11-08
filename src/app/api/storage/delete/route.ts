import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth/server'
import { deleteFromStorage } from '@/lib/storage/s3'

export async function POST(request: NextRequest) {
  try {
    const { data: session } = await auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const rawKey = body.key || body.public_id || body.storageKey

    if (!rawKey || typeof rawKey !== 'string' || !rawKey.trim()) {
      return NextResponse.json({ error: 'Storage key is required' }, { status: 400 })
    }

    const key = rawKey.trim()

    // Prevent path traversal and dangerous keys
    if (key.includes('..') || key.includes('\\') || key.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid storage key' }, { status: 400 })
    }

    await deleteFromStorage(key)

    return NextResponse.json({
      key,
      success: true,
    })
  } catch (error) {
    console.error('Storage deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete media asset from storage' },
      { status: 500 },
    )
  }
}
