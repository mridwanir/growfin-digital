import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendFomoReminderEmail, resolveRecipientEmail } from '@/lib/email';

export async function GET(request: Request) {
  return handleCron(request);
}

export async function POST(request: Request) {
  return handleCron(request);
}

async function handleCron(request: Request) {
  // 1. Verifikasi Keamanan Bearer Token CRON_SECRET
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    console.warn('[Cron FOMO] Unauthorized access attempt rejected.');
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing CRON_SECRET token' },
      { status: 401 }
    );
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // 2. Query data demo berstatus 'draft' yang fomo_expires_at berada di rentang 24 jam ke depan
    const { data: demos, error: fetchError } = await supabaseAdmin
      .from('business_demos')
      .select('id, name, slug, status, user_id, fomo_expires_at, metadata, draft_metadata')
      .eq('status', 'draft')
      .gt('fomo_expires_at', now.toISOString())
      .lte('fomo_expires_at', in24Hours.toISOString());

    if (fetchError) {
      console.error('[Cron FOMO] Database query error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!demos || demos.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tidak ada website draft dengan masa trial berakhir dalam 24 jam ke depan.',
        found: 0,
        sent: 0,
      });
    }

    let sentCount = 0;
    let skippedCount = 0;
    const processLog: Array<{
      slug: string;
      status: 'sent' | 'skipped' | 'failed';
      to?: string | null;
      resendId?: string | null;
      error?: string;
      reason?: string;
    }> = [];

    // 3. Iterasi dan kirim email peringatan ke setiap pemilik bisnis
    for (const demo of demos) {
      // Cek apakah sudah pernah dikirimi email reminder sebelumnya
      if (demo.metadata?.fomo_reminder_sent === true) {
        skippedCount++;
        processLog.push({
          slug: demo.slug,
          status: 'skipped',
          reason: 'Reminder already sent previously',
        });
        continue;
      }

      // Ambil email tujuan
      const toEmail = await resolveRecipientEmail(
        supabaseAdmin,
        demo.user_id,
        demo.metadata,
        demo.draft_metadata
      );

      if (!toEmail) {
        skippedCount++;
        processLog.push({
          slug: demo.slug,
          status: 'skipped',
          to: null,
          reason: 'No recipient email found in auth.users or metadata',
        });
        continue;
      }

      // Kirim email peringatan FOMO
      const emailRes = await sendFomoReminderEmail({
        toEmail,
        businessName: demo.name || 'Bisnis Anda',
        slug: demo.slug,
        expiresAt: demo.fomo_expires_at,
      });

      if (emailRes.success) {
        sentCount++;
        processLog.push({
          slug: demo.slug,
          status: 'sent',
          to: toEmail,
          resendId: emailRes.data?.id || null,
        });

        // HANYA tandai flag fomo_reminder_sent jika pengiriman benar-benar sukses
        const updatedMetadata = {
          ...(demo.metadata || {}),
          fomo_reminder_sent: true,
          fomo_reminder_sent_at: new Date().toISOString(),
          fomo_reminder_resend_id: emailRes.data?.id || null,
        };

        const { error: updateError } = await supabaseAdmin
          .from('business_demos')
          .update({ metadata: updatedMetadata })
          .eq('id', demo.id);

        if (updateError) {
          console.error(`[Cron FOMO] Failed to update metadata for ${demo.slug}:`, updateError);
        }
      } else {
        // JANGAN tandai fomo_reminder_sent di database jika email gagal!
        processLog.push({
          slug: demo.slug,
          status: 'failed',
          to: toEmail,
          error: emailRes.error ? String(emailRes.error) : 'Resend delivery failed',
        });
      }
    }

    return NextResponse.json({
      success: true,
      found: demos.length,
      sent: sentCount,
      skipped: skippedCount,
      details: processLog,
    });
  } catch (error: any) {
    console.error('[Cron FOMO Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
