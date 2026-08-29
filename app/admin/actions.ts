'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface TreatmentInput {
  name: string;
  desc: string;
  price: string;
  tag?: string;
  category: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ClinicInput {
  slug: string;
  name: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  phone: string;
  waNumber: string;
  address: string;
  googleMapsUrl: string;
  hours: string;
  tagline: string;
  iconEmoji: string;
  doctorName: string;
  doctorRole: string;
  doctorAvatarEmoji: string;
  doctorAvatarUrl?: string;
  doctorSampleUser?: string;
  doctorSampleDoctor?: string;
  treatments: TreatmentInput[];
}

export async function createClinicAction(data: ClinicInput) {
  const supabase = createServerSupabaseClient();
  const slug = data.slug.toLowerCase().trim().replace(/\s+/g, '-');

  // 1. Insert or update Clinic Record
  const { data: clinicData, error: clinicError } = await supabase
    .from('clinics')
    .upsert(
      {
        slug,
        name: data.name,
        category: data.category,
        city: data.city,
        rating: data.rating,
        review_count: data.reviewCount,
        phone: data.phone,
        wa_number: data.waNumber.replace(/\+/g, '').replace(/\s+/g, ''),
        address: data.address,
        google_maps_url: data.googleMapsUrl,
        hours: data.hours,
        tagline: data.tagline,
        icon_emoji: data.iconEmoji || '🩺',
      },
      { onConflict: 'slug' }
    )
    .select()
    .single();

  if (clinicError || !clinicData) {
    throw new Error(`Gagal menyimpan data klinik: ${clinicError?.message || 'Unknown error'}`);
  }

  const clinicId = clinicData.id;

  // 2. Insert or update Doctor Record
  await supabase.from('doctors').upsert({
    clinic_id: clinicId,
    name: data.doctorName,
    role: data.doctorRole,
    avatar_emoji: data.doctorAvatarEmoji || '👩‍⚕️',
    avatar_url: data.doctorAvatarUrl || null,
    sample_chat_user: data.doctorSampleUser || null,
    sample_chat_doctor: data.doctorSampleDoctor || null,
  });

  // 3. Replace/Insert Treatments Records
  if (data.treatments && data.treatments.length > 0) {
    // Delete existing treatments for clean sync
    await supabase.from('treatments').delete().eq('clinic_id', clinicId);

    const treatmentRows = data.treatments.map((t, idx) => ({
      clinic_id: clinicId,
      name: t.name,
      desc: t.desc,
      price: t.price,
      tag: t.tag || null,
      category: t.category,
      image_url: t.imageUrl || null,
      sort_order: t.sortOrder ?? idx,
      is_active: t.isActive ?? true,
    }));

    await supabase.from('treatments').insert(treatmentRows);
  }

  // 4. On-Demand Revalidation for Next.js App Router Cache
  revalidatePath(`/demo/${slug}`);
  revalidatePath('/');
  revalidatePath('/admin');

  return { success: true, slug };
}

export async function deleteClinicAction(id: string, slug: string) {
  const supabase = createServerSupabaseClient();
  await supabase.from('clinics').delete().eq('id', id);

  revalidatePath(`/demo/${slug}`);
  revalidatePath('/');
  revalidatePath('/admin');

  return { success: true };
}
