import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { sendInvoiceEmail, resolveRecipientEmail } from '@/lib/email';
import { verifyPayment, fetchMidtransStatus, sanitizeDraftMetadata } from './payment-verification';
import { PackageTier } from '@/lib/site-config';
export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { order_id, slug, payment_method, payment_gateway_ref } = await request.json(); // order_id is transactions.id
    const result = await verifyPayment(
      { order_id, slug, payment_method, payment_gateway_ref },
      {
        fetchExistingTransaction: async (orderId: string) => {
          const { data, error } = await supabaseAdmin
            .from('transactions')
            .select('id, status, user_id, snapshot_tier, amount')
            .eq('id', orderId)
            .single();
          if (error || !data) return null;
          return data;
        },
        fetchMidtransStatus: async (orderId: string) => {
          return fetchMidtransStatus(orderId);
        },
        onPaymentVerified: async ({
          order_id,
          slug,
          payment_method: verifiedMethod,
          payment_gateway_ref: verifiedRef,
        }) => {
          // 1. Update the transaction to paid with audit columns
          const { data: trxData, error: trxError } = await supabaseAdmin
            .from('transactions')
            .update({
              status: 'paid',
              paid_at: new Date().toISOString(),
              payment_method: verifiedMethod || null,
              payment_gateway_ref: verifiedRef || null,
            })
            .eq('id', order_id)
            .select('user_id, snapshot_tier, amount, paid_at, payment_method, transaction_type')
            .single();

          if (trxError) throw trxError;

          // 2. Fetch the business demo to finalize it
          const { data: businessData, error: fetchBizError } = await supabaseAdmin
            .from('business_demos')
            .select('name, draft_metadata, metadata, package_tier, site_active_until, domain_active_until, status')
            .eq('slug', slug)
            .single();

          if (fetchBizError) throw fetchBizError;

          const txType = trxData.transaction_type || 'activation';
          const tier = (trxData.snapshot_tier || businessData?.package_tier || 'instan') as PackageTier;
          const now = new Date();
          const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

          let siteActiveUntil: string | null = null;
          let domainActiveUntil: string | null = null;

          if (
            txType === 'renewal' &&
            businessData?.site_active_until &&
            new Date(businessData.site_active_until) > now
          ) {
            const currentExpiry = new Date(businessData.site_active_until);
            siteActiveUntil = new Date(currentExpiry.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
          } else {
            siteActiveUntil = oneYearFromNow;
          }

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

          // Sanitize draft_metadata.menu using sanitizeMenuItems with tierLimits.advancedVariants before saving to metadata
          const draftSource = (businessData.draft_metadata || businessData.metadata) as Record<string, unknown> | null;
          const sanitizedMetadata = sanitizeDraftMetadata(draftSource, tier);

          // Mark business as published with sanitized metadata
          const { error: bizError } = await supabaseAdmin
            .from('business_demos')
            .update({
              scraping_status: 'published',
              status: 'published',
              user_id: trxData.user_id,
              package_tier: tier,
              metadata: sanitizedMetadata || undefined,
              site_active_until: siteActiveUntil,
              domain_active_until: domainActiveUntil,
            })
            .eq('slug', slug);

          if (bizError) throw bizError;

          // Non-blocking invoice email dispatch
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
                businessName: businessData.name || (businessData.metadata && typeof businessData.metadata === 'object' && 'name' in businessData.metadata && typeof (businessData.metadata as Record<string, unknown>).name === 'string' ? (businessData.metadata as Record<string, unknown>).name as string : 'Bisnis Anda'),
                orderId: order_id,
                paidAt: trxData.paid_at || new Date().toISOString(),
                amount: trxData.amount || 0,
                packageTier: tier,
                paymentMethod: verifiedMethod || trxData.payment_method || 'Online Payment',
                slug,
              });
            }
          } catch (emailErr) {
            console.error('[Verify Route] Non-blocking invoice email dispatch error:', emailErr);
          }

          // On-Demand Revalidation
          try {
            revalidatePath(`/${slug}`);
            revalidatePath(`/site/${slug}`);
          } catch (revalidateErr) {
            console.warn('[Verify Route] Revalidation error:', revalidateErr);
          }

          return { success: true };
        },
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, status: result.status },
        { status: result.httpStatus || 400 }
      );
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    console.error('Verify Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
