import { redirect } from 'next/navigation';
import { BusinessDemo } from '@/lib/types';
import { ServiceDemoClient } from '@/components/demo/service-demo-client';
import { FnbDemoClient } from '@/components/demo/fnb-demo-client';
import { RetailDemoClient } from '@/components/demo/retail-demo-client';
import { GroomingDemoClient } from '@/components/demo/grooming-demo-client';
import { getMockData } from '@/lib/mock-data';
import { supabase } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';
import { resolveTemplateType } from '@/lib/template-resolver';
import { DemoEditorWrapper } from '@/components/demo/editor/DemoEditorWrapper';
import type { Metadata } from 'next';

interface DemoPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

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

  // 3. Auth Guard: Check if demo is claimed
  if (dbData.user_id) {
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    
    if (!user || user.id !== dbData.user_id) {
      // If unauthorized or not logged in, redirect to public site
      redirect(`/${slug}`);
    }
  }

  // 4. Determine Template Type using Resolver
  const templateType = resolveTemplateType(dbData.category);
  const metadataSource = dbData.draft_metadata || dbData.metadata;
  const isMigratedData = !!metadataSource;
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
      rating: metadataSource.rating,
      reviewCount: metadataSource.reviewCount,
      address: metadataSource.address,
      hours: typeof metadataSource.hours === 'string'
        ? metadataSource.hours
        : (metadataSource.hours?.text || "Buka Setiap Hari"),
      openTime: metadataSource.openTime || metadataSource.hours?.openTime,
      closeTime: metadataSource.closeTime || metadataSource.hours?.closeTime,
      tagline: metadataSource.tagline,
      iconEmoji: metadataSource.iconEmoji || '🏢',
      practitioners: metadataSource.practitioners || (metadataSource.doctor ? [
        {
          id: '1',
          name: metadataSource.doctor.name || 'Admin',
          role: metadataSource.doctor.role || 'Staff',
          avatarEmoji: metadataSource.doctor.avatarEmoji || '👨‍💼',
          avatarUrl: metadataSource.doctor.avatarUrl,
        }
      ] : [
        { id: '1', name: 'Admin', role: 'Staff', avatarEmoji: '👨‍💼' }
      ]),
      categories: metadataSource.categories || [],
      menu: metadataSource.menu || metadataSource.products || [],
      reviews: metadataSource.reviews || [],
      heroImage: metadataSource.heroImage,
      instagramFeed: metadataSource.instagramFeed,
      fbType: metadataSource.fbType,
      themeColor: metadataSource.themeColor || metadataSource.theme_color,
      package_tier: dbData.package_tier,
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
      package_tier: dbData.package_tier,
    };
  }

  // Route to the appropriate template via Editor Wrapper
  const layoutVariant = dbData.layout_id === 'modern-default' ? 'classic' : dbData.layout_id;

  return (
    <DemoEditorWrapper
      initialClient={genericClient}
      initialLayout={layoutVariant}
      templateType={templateType}
      slug={slug}
    />
  );
}
