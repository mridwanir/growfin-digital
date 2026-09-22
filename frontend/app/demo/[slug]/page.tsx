import { demosData, BusinessDemo } from '@/lib/demos';
import { ClinicDemoClient } from '@/components/clinic-demo-client';
import { CafeDemoClient } from '@/components/cafe-demo-client';
import { getMockData } from '@/lib/mock-data';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next';

interface DemoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Try to get from Supabase
  const { data: dbData } = await supabase
    .from('business_demos')
    .select('name')
    .eq('slug', slug)
    .single();

  const clientName = dbData?.name || demosData[slug.toLowerCase()]?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${clientName} — Live Demo Preview`,
    description: `Website preview untuk ${clientName}.`,
  };
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;

  // 1. Fetch from Supabase
  const { data: dbData } = await supabase
    .from('business_demos')
    .select('*')
    .eq('slug', slug)
    .single();

  // 2. Determine Data Source
  if (dbData) {
    const mock = getMockData(dbData.category);
    const categoryLower = dbData.category.toLowerCase();

    // For Cafe, we use the new Profile format
    if (categoryLower.includes('cafe') || categoryLower.includes('resto') || categoryLower.includes('coffee')) {
      const profile = {
        name: dbData.name,
        category: dbData.category,
        city: dbData.city,
        phone: dbData.phone,
        waNumber: dbData.phone.replace(/\D/g, ''),
        mapsUrl: dbData.maps_url,
        ...mock,
      };
      return <CafeDemoClient profile={profile} />;
    }

    // For Clinic/Fallback, we map back to the legacy BusinessDemo format expected by ClinicDemoClient
    const legacyCompatibleClient: BusinessDemo = {
      name: dbData.name,
      category: dbData.category,
      city: dbData.city,
      rating: 4.9,
      reviewCount: 152,
      phone: dbData.phone,
      address: `${dbData.city}, Indonesia`,
      googleMapsUrl: dbData.maps_url,
      hours: mock.hours,
      waNumber: dbData.phone.replace(/\D/g, ''),
      tagline: mock.tagline,
      iconEmoji: '⚕️',
      doctor: {
        name: 'dr. Ahli Utama',
        role: 'Spesialis Medis',
        avatarEmoji: '👨‍⚕️',
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
        sampleChat: {
          user: 'Halo, saya mau buat janji temu.',
          doctor: 'Halo! Silakan beri tahu keluhan Anda agar kami bisa menjadwalkan kunjungan terbaik.',
          recommendationTitle: 'Konsultasi & Pemeriksaan',
          recommendationDesc: 'Jadwalkan sekarang untuk kesehatan Anda.',
        }
      },
      categories: ['Semua', 'Pemeriksaan', 'Layanan Utama'],
      menu: mock.products.map(p => ({
        id: p.id,
        name: p.name,
        desc: p.desc,
        price: p.price,
        category: p.category,
        imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80'
      })),
      reviews: mock.reviews,
    };

    return <ClinicDemoClient client={legacyCompatibleClient} />;
  }

  // 3. Fallback to Legacy Static Data
  const baseClient: BusinessDemo | undefined = demosData[slug.toLowerCase()];
  if (baseClient) {
    return <ClinicDemoClient client={baseClient} />;
  }

  // 4. Not Found
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0E] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-black mb-4">404 - Demo Not Found</h1>
        <p className="text-[#8E8EA0]">Template bisnis yang Anda cari tidak ditemukan.</p>
      </div>
    </div>
  );
}
