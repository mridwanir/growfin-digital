import { BusinessDemo } from '@/lib/types';
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

  // Fetch from Supabase
  const { data: dbData } = await supabase
    .from('business_demos')
    .select('name')
    .eq('slug', slug)
    .single();

  const clientName = dbData?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

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

  if (!dbData) {
    // 2. Not Found
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0E] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">404 - Demo Not Found</h1>
          <p className="text-[#8E8EA0]">Template bisnis yang Anda cari tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  // 3. Determine Data Source (Metadata vs Mock)
  const isMigratedData = !!dbData.metadata;
  const mock = isMigratedData ? null : getMockData(dbData.category);
  const categoryLower = dbData.category.toLowerCase();

  // For Cafe/Resto
  if (categoryLower.includes('cafe') || categoryLower.includes('resto') || categoryLower.includes('coffee')) {
    // If it's AI generated (no metadata), use mock. Currently Cafe doesn't have metadata structure in demos.ts,
    // but if it did, we'd map it here. We'll use mock for now or merge metadata if it existed.
    const profile = {
      name: dbData.name,
      category: dbData.category,
      city: dbData.city,
      phone: dbData.phone,
      waNumber: dbData.phone.replace(/\D/g, ''),
      mapsUrl: dbData.maps_url,
      ...(isMigratedData ? dbData.metadata : mock),
    };
    return <CafeDemoClient profile={profile} />;
  }

  // For Clinic (or general legacy types)
  let clinicClient: BusinessDemo;

  if (isMigratedData) {
    // Use exact structure from Supabase metadata
    clinicClient = {
      name: dbData.name,
      category: dbData.category,
      city: dbData.city,
      phone: dbData.phone,
      googleMapsUrl: dbData.maps_url,
      waNumber: dbData.phone.replace(/\D/g, ''),
      rating: dbData.metadata.rating,
      reviewCount: dbData.metadata.reviewCount,
      address: dbData.metadata.address,
      hours: dbData.metadata.hours,
      tagline: dbData.metadata.tagline,
      iconEmoji: dbData.metadata.iconEmoji,
      doctor: dbData.metadata.doctor,
      categories: dbData.metadata.categories,
      menu: dbData.metadata.menu,
      reviews: dbData.metadata.reviews,
    };
  } else {
    // Fallback to dynamic AI Generation + Mock Data
    clinicClient = {
      name: dbData.name,
      category: dbData.category,
      city: dbData.city,
      rating: 4.9,
      reviewCount: 152,
      phone: dbData.phone,
      address: `${dbData.city}, Indonesia`,
      googleMapsUrl: dbData.maps_url,
      hours: mock!.hours,
      waNumber: dbData.phone.replace(/\D/g, ''),
      tagline: mock!.tagline,
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
      menu: mock!.products.map(p => ({
        id: p.id,
        name: p.name,
        desc: p.desc,
        price: p.price,
        category: p.category,
        imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80'
      })),
      reviews: mock!.reviews,
    };
  }

  return <ClinicDemoClient client={clinicClient} />;
}
