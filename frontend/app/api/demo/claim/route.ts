import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    const { slug, user_id } = await request.json();

    if (!slug || !user_id) {
      return NextResponse.json({ error: 'Missing slug or user_id' }, { status: 400 });
    }

    // Attempt to claim the business demo.
    // We only update if user_id is currently NULL (unclaimed).
    // This query is safe because it will affect 0 rows if it's already claimed.
    const { error } = await supabaseAdmin
      .from('business_demos')
      .update({ 
        user_id: user_id,
        // Extend the FOMO trial by 7 days from now
        fomo_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        // If it was locked, revert it back to draft so they can preview it during the 7 day period
        status: 'draft'
      })
      .eq('slug', slug)
      .is('user_id', null);

    if (error) {
      console.error('Claim error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error in /api/demo/claim:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
