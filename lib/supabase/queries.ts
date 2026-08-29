import { createServerSupabaseClient } from './server';
import { DEMO_DATA, BusinessDemo } from '@/lib/demos';

export async function getClinicBySlug(slug: string): Promise<BusinessDemo | null> {
  const normalizedSlug = slug.toLowerCase();

  // 1. Attempt DB fetch if Supabase environment variables are configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createServerSupabaseClient();

      // Fetch clinic
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .select('*')
        .eq('slug', normalizedSlug)
        .single();

      if (!clinicError && clinicData) {
        // Fetch doctor info
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('*')
          .eq('clinic_id', clinicData.id)
          .single();

        // Fetch active treatments sorted by sort_order
        const { data: treatmentsData } = await supabase
          .from('treatments')
          .select('*')
          .eq('clinic_id', clinicData.id)
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        // Map DB record to BusinessDemo interface
        const mappedClinic: BusinessDemo = {
          name: clinicData.name,
          category: clinicData.category,
          city: clinicData.city,
          rating: parseFloat(clinicData.rating || '5.0'),
          reviewCount: parseInt(clinicData.review_count || '100'),
          phone: clinicData.phone,
          waNumber: clinicData.wa_number,
          address: clinicData.address,
          googleMapsUrl: clinicData.google_maps_url,
          hours: clinicData.hours,
          tagline: clinicData.tagline,
          iconEmoji: clinicData.icon_emoji || '🩺',
          doctor: {
            name: doctorData?.name || 'Dokter Penanggung Jawab',
            role: doctorData?.role || 'Spesialis Medis',
            avatarEmoji: doctorData?.avatar_emoji || '👩‍⚕️',
            avatarUrl: doctorData?.avatar_url,
            sampleChat: doctorData?.sample_chat_user
              ? {
                  user: doctorData.sample_chat_user,
                  doctor: doctorData.sample_chat_doctor,
                  recommendationTitle: 'Konsultasi & Check-up',
                  recommendationDesc: 'Jadwalkan konsultasi dokter hari ini.',
                }
              : undefined,
          },
          categories: Array.from(
            new Set(['Semua', ...(treatmentsData?.map((t) => t.category) || [])])
          ),
          menu: (treatmentsData || []).map((t, idx) => ({
            id: idx + 1,
            name: t.name,
            desc: t.desc,
            price: t.price,
            tag: t.tag,
            category: t.category,
            imageUrl: t.image_url,
          })),
        };

        return mappedClinic;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, using fallback DEMO_DATA:', err);
    }
  }

  // 2. Fallback to DEMO_DATA dictionary
  return DEMO_DATA[normalizedSlug] || null;
}

export async function getAllClinicsFromDB(): Promise<Array<{ id: string; slug: string; name: string; category: string; city: string; rating: number }>> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('clinics')
        .select('id, slug, name, category, city, rating')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          ...item,
          rating: parseFloat(item.rating || '5.0'),
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch clinics from DB:', err);
    }
  }

  // Fallback to DEMO_DATA keys
  return Object.entries(DEMO_DATA).map(([slug, clinic]) => ({
    id: slug,
    slug,
    name: clinic.name,
    category: clinic.category,
    city: clinic.city,
    rating: clinic.rating,
  }));
}
