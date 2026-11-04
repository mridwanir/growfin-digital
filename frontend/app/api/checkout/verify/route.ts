import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { sendInvoiceEmail, resolveRecipientEmail } from '@/lib/email';
import { fetchMidtransStatus, validatePaymentStatus } from './payment-verification';
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
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (existingTrx.status === 'paid') {
      return NextResponse.json({ success: true, message: 'Transaction already paid' });
    }

    // 2. Query server-authoritative Midtrans Status API
    const statusResponse = await fetchMidtransStatus(order_id);

    // Validate payment status: only settlement or capture-accept are permitted
    const validation = validatePaymentStatus(statusResponse);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.message, status: validation.status },
        { status: validation.httpStatus || 400 }
      );
    }

    // 3. Update the transaction to paid with audit columns
    const verifiedPaymentMethod = statusResponse.payment_type || payment_method || null;
    const verifiedPaymentRef = statusResponse.transaction_id || payment_gateway_ref || null;

    const { data: trxData, error: trxError } = await supabaseAdmin
      .from('transactions')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        payment_method: verifiedPaymentMethod,
        payment_gateway_ref: verifiedPaymentRef,
      })
      .eq('id', order_id)
      .select('user_id, snapshot_tier, amount, paid_at, payment_method, transaction_type')
      .single();

    if (trxError) throw trxError;

    // 3. Fetch the business demo to finalize it
    const { data: businessData, error: fetchBizError } = await supabaseAdmin
      .from('business_demos')
      .select('name, draft_metadata, metadata, package_tier, site_active_until, domain_active_until, status')
      .eq('slug', slug)
      .single();

    if (fetchBizError) throw fetchBizError;

    const txType = trxData.transaction_type || 'activation';
    const tier = trxData.snapshot_tier || businessData?.package_tier || 'instan';
    const now = new Date();
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    let siteActiveUntil: string | null = null;
    let domainActiveUntil: string | null = null;

    // Untuk semua paket berbayar (instan, pro-basic, pro-advanced):
    // 1. Logika site_active_until:
    if (
      txType === 'renewal' && 
      businessData?.site_active_until && 
      new Date(businessData.site_active_until) > now
    ) {
      // Jika renewal dan site_active_until masih di masa depan (belum expired),
      // tambahkan +365 hari dari tanggal site_active_until yang ada (agar sisa hari tidak hangus)
      const currentExpiry = new Date(businessData.site_active_until);
      siteActiveUntil = new Date(currentExpiry.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
    } else {
      // Jika upgrade, activation, atau jika website sudah terlanjur expired
      siteActiveUntil = oneYearFromNow;
    }

    // 2. Logika domain_active_until (khusus untuk pro-basic ke atas):
    if (tier === 'pro-basic' || tier === 'pro-advanced' || tier === 'enterprise') {
      if (
        txType === 'renewal' &&
        businessData?.domain_active_until &&
        new Date(businessData.domain_active_until) > now
      ) {
        const currentDomainExpiry = new Date(businessData.domain_active_until);
        domainActiveUntil = new Date(currentDomainExpiry.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
      } else {
        domainActiveUntil = oneYearFromNow;
      }
    } else {
      domainActiveUntil = null;
    }

    // 4. Mark the business as published (unlocking if previously locked), link user, copy draft to metadata, and set expiration
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
          businessName: businessData.name || (businessData.metadata && typeof businessData.metadata === 'object' && 'name' in businessData.metadata && typeof businessData.metadata.name === 'string' ? businessData.metadata.name : 'Bisnis Anda'),
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

    // 6. On-Demand Revalidation: Segarkan cache situs publik secara instan
    try {
      revalidatePath(`/${slug}`);
      revalidatePath(`/site/${slug}`);
    } catch (revalidateErr) {
      console.warn('[Verify Route] Revalidation error:', revalidateErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    console.error('Verify Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
