import { BusinessDemo } from '@/lib/types';
import { ClinicDemoClient } from '@/components/demo/clinic-demo-client';
import { CafeDemoClient } from '@/components/demo/cafe-demo-client';
import { RetailDemoClient } from '@/components/demo/retail-demo-client';
import { GroomingDemoClient } from '@/components/demo/grooming-demo-client';
import { getMockData } from '@/lib/mock-data';
import { supabase } from '@/lib/supabase';
import { DynamicThemeProvider } from '@/components/demo/DynamicThemeProvider';
import { resolveTemplateType } from '@/lib/template-resolver';
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

  // 3. Determine Template Type using Resolver
  const templateType = resolveTemplateType(dbData.category);
  const isMigratedData = !!dbData.metadata;
  const mock = isMigratedData ? null : getMockData(dbData.category);

  // Common data transformation for Service, Retail, and FNB
  let genericClient: BusinessDemo;

  if (isMigratedData) {
    // Use exact structure from Supabase metadata
    genericClient = {
      name: dbData.name,
      category: dbData.category,
      city: dbData.city,
      phone: dbData.phone,
      googleMapsUrl: dbData.maps_url,
      waNumber: dbData.phone.replace(/\D/g, ''),
      rating: dbData.metadata.rating,
      reviewCount: dbData.metadata.reviewCount,
      address: dbData.metadata.address,
      hours: typeof dbData.metadata.hours === 'string'
        ? dbData.metadata.hours
        : (dbData.metadata.hours?.text || "Buka Setiap Hari"),
      openTime: dbData.metadata.openTime || dbData.metadata.hours?.openTime,
      closeTime: dbData.metadata.closeTime || dbData.metadata.hours?.closeTime,
      tagline: dbData.metadata.tagline,
      iconEmoji: dbData.metadata.iconEmoji || '🏢',
      practitioners: dbData.metadata.practitioners || (dbData.metadata.doctor ? [
        {
          id: '1',
          name: dbData.metadata.doctor.name || 'Admin',
          role: dbData.metadata.doctor.role || 'Staff',
          avatarEmoji: dbData.metadata.doctor.avatarEmoji || '👨‍💼',
          avatarUrl: dbData.metadata.doctor.avatarUrl,
        }
      ] : [
        { id: '1', name: 'Admin', role: 'Staff', avatarEmoji: '👨‍💼' }
      ]),
      categories: dbData.metadata.categories || [],
      menu: dbData.metadata.menu || dbData.metadata.products || [],
      reviews: dbData.metadata.reviews || [],
      heroImage: dbData.metadata.heroImage,
      instagramFeed: dbData.metadata.instagramFeed,
      fbType: dbData.metadata.fbType,
      themeColor: dbData.metadata.themeColor || dbData.metadata.theme_color,
    };
  } else {
    // Fallback to dynamic AI Generation + Mock Data
    genericClient = {
      name: dbData.name,
      category: dbData.category,
      city: dbData.city,
      rating: 4.9,
      reviewCount: 152,
      phone: dbData.phone,
      address: `${dbData.city}, Indonesia`,
      googleMapsUrl: dbData.maps_url,
      hours: mock!.hours,
      openTime: mock!.openTime,
      closeTime: mock!.closeTime,
      waNumber: dbData.phone.replace(/\D/g, ''),
      tagline: mock!.tagline,
      iconEmoji: '🏢',
      practitioners: [
        {
          id: '1',
          name: 'Konsultan',
          role: 'Spesialis',
          avatarEmoji: '👨‍💼',
          avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
        }
      ],
      categories: ['Semua', ...Array.from(new Set(mock!.products.map(p => p.category)))],
      menu: mock!.products.map(p => ({
        id: p.id,
        name: p.name,
        desc: p.desc,
        price: p.price,
        category: p.category,
        imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80',
        variants: p.variants,
        addons: p.addons,
      })),
      reviews: mock!.reviews,
      heroImage: mock!.heroImage,
      instagramFeed: mock!.instagramFeed,
      fbType: mock!.fbType,
      themeColor: mock!.themeColor,
    };
  }

  // Route to the appropriate template
  let demoComponent;
  if (templateType === 'fnb') {
    demoComponent = <CafeDemoClient client={genericClient} />;
  } else if (templateType === 'service') {
    demoComponent = <ClinicDemoClient client={genericClient} />;
  } else if (templateType === 'grooming') {
    demoComponent = <GroomingDemoClient client={genericClient} />;
  } else {
    // Fallback / Retail Template
    demoComponent = <RetailDemoClient client={genericClient} />;
  }

  return (
    <DynamicThemeProvider themeColor={genericClient.themeColor}>
      {demoComponent}
    </DynamicThemeProvider>
  );
}
