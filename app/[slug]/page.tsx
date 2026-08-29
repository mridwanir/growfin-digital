import { notFound } from 'next/navigation';
import { getClinicBySlug } from '@/lib/supabase/queries';
import { ClinicDemoClient } from '@/components/clinic-demo-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DirectSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const clinic = await getClinicBySlug(slug);

  if (!clinic) {
    return notFound();
  }

  return <ClinicDemoClient client={clinic} />;
}