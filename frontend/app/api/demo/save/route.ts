import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Instantiate an admin client bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, clientData, layout_id } = body;

    if (!slug || !clientData) {
      return NextResponse.json(
        { error: 'Missing required fields: slug or clientData' },
        { status: 400 }
      );
    }

    // Prepare update payload
    const payload: any = {
      metadata: clientData,
      // If layout_id is provided, save it too
      ...(layout_id && { layout_id })
    };

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

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Save API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
