import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const body = await request.json();
    const { slug, clientData, layout_id, publish } = body;

    if (!slug || !clientData) {
      return NextResponse.json(
        { error: 'Missing required fields: slug or clientData' },
        { status: 400 }
      );
    }

    // 1. Cek status bisnis di database untuk memastikan keamanan status published
    const { data: existingDemo, error: fetchError } = await supabaseAdmin
      .from('business_demos')
      .select('id, status, package_tier')
      .eq('slug', slug)
      .single();

    if (fetchError || !existingDemo) {
      return NextResponse.json(
        { error: 'Bisnis tidak ditemukan' },
        { status: 404 }
      );
    }

    const isPublishedBusiness = existingDemo.status === 'published';

    // 2. Prepare update payload
    // Saat draft (publish: false) atau bisnis belum berstatus published (belum bayar),
    // HANYA update draft_metadata agar editan tidak bocor ke live site dan tidak bisa aktif gratis.
    const payload: any = {
      draft_metadata: clientData,
      // If layout_id is provided, save it too
      ...(layout_id && { layout_id })
    };

    // 3. Keamanan Status: metadata dan kolom root HANYA disalin/di-update
    // jika publish: true DAN bisnis memang sudah berstatus 'published' (sudah menyelesaikan pembayaran)
    if (publish && isPublishedBusiness) {
      payload.metadata = clientData;
      if (clientData.name) {
        payload.name = clientData.name;
      }
      if (clientData.phone || clientData.waNumber) {
        payload.phone = clientData.phone || clientData.waNumber;
      }
      if (clientData.googleMapsUrl) {
        payload.maps_url = clientData.googleMapsUrl;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('business_demos')
      .update(payload)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Supabase Save Error:', error);
      return NextResponse.json(
        { error: 'Gagal menyimpan perubahan ke database.', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isPublished: publish && isPublishedBusiness,
      requiresUpgrade: publish && !isPublishedBusiness,
      data
    });

  } catch (error) {
    console.error('Save API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
