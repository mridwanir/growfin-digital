import { BusinessDemo } from '@/lib/types';
import { ServiceDemoClient } from '@/components/demo/service-demo-client';
import { FnbDemoClient } from '@/components/demo/fnb-demo-client';
import { RetailDemoClient } from '@/components/demo/retail-demo-client';
import { GroomingDemoClient } from '@/components/demo/grooming-demo-client';
import { supabase } from '@/lib/supabase';
import { resolveTemplateType } from '@/lib/template-resolver';
import { DynamicThemeProvider } from '@/components/demo/DynamicThemeProvider';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface SitePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const { slug } = await params;

  // Fetch from Supabase (by slug or custom_domain)
  const { data: dbData } = await supabase
    .from('business_demos')
    .select('name, metadata')
    .or(`slug.eq.${slug},custom_domain.eq.${slug}`)
    .eq('status', 'published')
    .single();

  if (!dbData) return { title: 'Site Not Found' };

  return {
    title: `${dbData.name} | By Growfin`,
    description: dbData.metadata?.tagline || `Official website of ${dbData.name}`,
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const { slug } = await params;

  // 1. Fetch from Supabase, only published sites
  const { data: dbData } = await supabase
    .from('business_demos')
    .select('*')
    .or(`slug.eq.${slug},custom_domain.eq.${slug}`)
    .eq('status', 'published')
    .single();

  if (!dbData || !dbData.metadata) {
    // 2. Not Found or Not Published yet
    notFound();
  }

  // 3. Determine Template Type using Resolver
  const templateType = resolveTemplateType(dbData.category);

  // 4. Map DB metadata to genericClient (Strictly use metadata, NEVER draft_metadata)
  const genericClient: BusinessDemo = {
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
    package_tier: dbData.package_tier,
  };

  // Route to the appropriate template directly (No Editor Wrapper)
  const layoutVariant = dbData.layout_id === 'modern-default' ? 'classic' : dbData.layout_id;

  let demoComponent;
  if (templateType === 'fnb') {
    demoComponent = <FnbDemoClient client={genericClient} themeVariant={layoutVariant} />;
  } else if (templateType === 'service') {
    demoComponent = <ServiceDemoClient client={genericClient} />;
  } else if (templateType === 'grooming') {
    demoComponent = <GroomingDemoClient client={genericClient} themeVariant={layoutVariant} />;
  } else {
    demoComponent = <RetailDemoClient client={genericClient} themeVariant={layoutVariant} />;
  }

  return (
    <DynamicThemeProvider themeColor={genericClient.themeColor}>
      {demoComponent}
    </DynamicThemeProvider>
  );
}
