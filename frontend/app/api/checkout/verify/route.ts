import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { order_id, slug } = await request.json(); // order_id is now the transactions.id

    // 1. Update the transaction to paid
    const { data: trxData, error: trxError } = await supabaseAdmin
      .from('transactions')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', order_id)
      .select('user_id')
      .single();

    if (trxError) throw trxError;

    // 2. Fetch the draft metadata to finalize it
    const { data: businessData, error: fetchBizError } = await supabaseAdmin
      .from('business_demos')
      .select('draft_metadata')
      .eq('slug', slug)
      .single();

    if (fetchBizError) throw fetchBizError;

    // 3. Mark the business as published, link user, and copy draft to metadata
    const { error: bizError } = await supabaseAdmin
      .from('business_demos')
      .update({ 
        scraping_status: 'published',
        status: 'published',
        user_id: trxData.user_id,
        metadata: businessData.draft_metadata || undefined
      }) 
      .eq('slug', slug);

    if (bizError) throw bizError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Verify Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
