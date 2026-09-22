import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Generate a URL-friendly slug from the business name
function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  
  const uniqueId = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${uniqueId}`;
}

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
    const { name, category, phone, city, mapsUrl } = body;

    // Validate required fields
    if (!name || !category || !phone || !city || !mapsUrl) {
      return NextResponse.json(
        { error: 'All fields (name, category, phone, city, mapsUrl) are required.' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);

    // Check if this phone number already generated a template
    const { data: existingData, error: findError } = await supabase
      .from('business_demos')
      .select('slug')
      .eq('phone', normalizedPhone)
      .maybeSingle(); // Use maybeSingle to avoid errors when 0 rows returned

    if (findError) {
      console.error('Supabase Find Error:', findError);
      return NextResponse.json(
        { error: 'Failed to verify existing records.' },
        { status: 500 }
      );
    }

    if (existingData) {
      // Return existing slug so frontend can redirect directly
      return NextResponse.json({ success: true, slug: existingData.slug, isExisting: true });
    }

    // Proceed to generate and insert if not found
    const slug = generateSlug(name);

    // Insert into Supabase
    const { data, error } = await supabase
      .from('business_demos')
      .insert([
        {
          slug,
          name,
          category,
          phone: normalizedPhone,
          city,
          maps_url: mapsUrl,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json(
        { error: 'Failed to generate demo. Database error.' },
        { status: 500 }
      );
    }

    // Return the generated slug so the client can redirect
    return NextResponse.json({ success: true, slug: data.slug, isExisting: false });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
