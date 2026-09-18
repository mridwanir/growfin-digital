import { notFound } from 'next/navigation';
import { DEMO_DATA } from '@/lib/demos';
import { ClinicDemoClient } from '@/components/clinic-demo-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DemoPage({ params }: PageProps) {
  const { slug } = await params;
  const clinic = DEMO_DATA[slug.toLowerCase()];

  if (!clinic) {
    return notFound();
  }

  return <ClinicDemoClient client={clinic} />;
}