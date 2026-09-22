import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Normalize phone number to consistent 628... format
function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');
  
  // Handle 08... -> 628...
  if (digits.startsWith('0')) {
    digits = '62' + digits.substring(1);
  }
  
  return digits;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp diperlukan untuk pencarian.' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);

    // Search in Supabase
    const { data, error } = await supabase
      .from('business_demos')
      .select('slug')
      .eq('phone', normalizedPhone)
      .maybeSingle();

    if (error) {
      console.error('Supabase Find Error:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat mencari data.' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp tidak ditemukan. Anda belum pernah membuat template.' },
        { status: 404 }
      );
    }

    // Return the slug
    return NextResponse.json({ success: true, slug: data.slug });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
