import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
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

    // 2. Ensure profile exists (Supabase Auth trigger usually handles this, but let's be safe)
    // We don't have enough data to upsert the profile completely, assuming trigger is there or we just rely on user_id fk.
    
    // 3. Mark the business as published and link user
    const { error: bizError } = await supabaseAdmin
      .from('business_demos')
      .update({ 
        scraping_status: 'published',
        status: 'published', // we have both 'status' and 'scraping_status'
        user_id: trxData.user_id
      }) 
      .eq('slug', slug);

    if (bizError) throw bizError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Verify Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
