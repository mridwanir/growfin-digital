import { redirect } from 'next/navigation';
import { demosData } from '@/lib/demos';

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(demosData).map((slug) => ({ slug }));
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  if (!demosData[slug.toLowerCase()]) {
    redirect('/');
  }

  redirect(`/demo/${slug.toLowerCase()}`);
}
