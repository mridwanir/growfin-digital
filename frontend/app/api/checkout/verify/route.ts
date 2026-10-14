import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendInvoiceEmail, resolveRecipientEmail } from '@/lib/email';

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { order_id, slug, payment_method, payment_gateway_ref } = await request.json(); // order_id is transactions.id

    // 1. Fetch current transaction status for idempotency check
    const { data: existingTrx, error: trxFetchError } = await supabaseAdmin
      .from('transactions')
      .select('id, status, user_id, snapshot_tier, amount')
      .eq('id', order_id)
      .single();

    if (trxFetchError || !existingTrx) {
      throw new Error('Transaction not found');
    }

    if (existingTrx.status === 'paid') {
      return NextResponse.json({ success: true, message: 'Transaction already paid' });
    }

    // 2. Update the transaction to paid with audit columns
    const { data: trxData, error: trxError } = await supabaseAdmin
      .from('transactions')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        payment_method: payment_method || null,
        payment_gateway_ref: payment_gateway_ref || null,
      })
      .eq('id', order_id)
      .select('user_id, snapshot_tier, amount, paid_at, payment_method')
      .single();

    if (trxError) throw trxError;

    // 3. Fetch the business demo to finalize it
    const { data: businessData, error: fetchBizError } = await supabaseAdmin
      .from('business_demos')
      .select('name, draft_metadata, metadata, package_tier')
      .eq('slug', slug)
      .single();

    if (fetchBizError) throw fetchBizError;

    const tier = trxData.snapshot_tier || businessData?.package_tier || 'instan';
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    let siteActiveUntil: string | null = null;
    let domainActiveUntil: string | null = null;

    if (tier === 'pro-advanced') {
      siteActiveUntil = oneYearFromNow;
      domainActiveUntil = oneYearFromNow;
    } else if (tier === 'pro-basic') {
      siteActiveUntil = null;
      domainActiveUntil = oneYearFromNow;
    } else {
      siteActiveUntil = null;
      domainActiveUntil = null;
    }

    // 4. Mark the business as published, link user, copy draft to metadata, and set expiration
    const { error: bizError } = await supabaseAdmin
      .from('business_demos')
      .update({ 
        scraping_status: 'published',
        status: 'published',
        user_id: trxData.user_id,
        package_tier: tier,
        metadata: businessData.draft_metadata || businessData.metadata || undefined,
        site_active_until: siteActiveUntil,
        domain_active_until: domainActiveUntil,
      }) 
      .eq('slug', slug);

    if (bizError) throw bizError;

    // 5. Kirim Email Invoice Resmi via Resend (Non-blocking)
    try {
      const recipientEmail = await resolveRecipientEmail(
        supabaseAdmin,
        trxData.user_id,
        businessData.metadata,
        businessData.draft_metadata
      );

      if (recipientEmail) {
        await sendInvoiceEmail({
          toEmail: recipientEmail,
          businessName: businessData.name || (businessData.metadata as any)?.name || 'Bisnis Anda',
          orderId: order_id,
          paidAt: trxData.paid_at || new Date().toISOString(),
          amount: trxData.amount || 0,
          packageTier: tier,
          paymentMethod: payment_method || trxData.payment_method || 'Online Payment',
          slug,
        });
      }
    } catch (emailErr) {
      console.error('[Verify Route] Non-blocking invoice email dispatch error:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Verify Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
