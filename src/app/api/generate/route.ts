import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { generateStorefrontDraft } from '@/features/generator/server'

export async function POST(request: NextRequest) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 })
    }

    const result = await generateStorefrontDraft(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    console.error('Website generation error:', error)

    return NextResponse.json({ error: `Failed to generate website: ${message}` }, { status: 500 })
  }
}
