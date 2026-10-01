import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { business_id, event_type, visitor_id } = await request.json();

    if (!business_id || !event_type) {
      return NextResponse.json({ error: 'Missing business_id or event_type' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('analytics_events')
      .insert([
        {
          business_id,
          event_type,
          visitor_id: visitor_id || 'anonymous'
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics Track Error:', error);
    // Don't expose internal errors to the client for tracking
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
