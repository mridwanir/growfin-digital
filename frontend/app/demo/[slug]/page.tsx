import { demosData, BusinessDemo } from '@/lib/demos';
import { ClinicDemoClient } from '@/components/clinic-demo-client';
import type { Metadata } from 'next';

interface DemoPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return Object.keys(demosData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sParams = await searchParams;
  const clientName =
    (sParams.name as string) ||
    demosData[slug.toLowerCase()]?.name ||
    slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${clientName} — Demo Klinik & Treatment Medis`,
    description: `Preview layanan klinik dan reservasi online via WhatsApp untuk ${clientName}.`,
  };
}

export default async function DemoPage({ params, searchParams }: DemoPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;

  const baseClient: BusinessDemo | undefined = demosData[slug.toLowerCase()];

  const defaultFallback: BusinessDemo = {
    name: (sParams.name as string) || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    category: 'Klinik Gigi & Estetika Medis',
    city: 'Jakarta',
    rating: parseFloat((sParams.rating as string) || '4.9'),
    reviewCount: parseInt((sParams.reviews as string) || '124'),
    phone: (sParams.phone as string) || '+62 812 3456 789',
    address: (sParams.address as string) || 'Jl. Senopati No. 22, Jakarta',
    googleMapsUrl: 'https://maps.google.com',
    hours: 'Open · 09.00 AM - 09.00 PM',
    waNumber: ((sParams.phone as string) || '628123456789').replace(/\+/g, '').replace(/\s+/g, ''),
    tagline: 'Beautiful Smile, Confident You',
    iconEmoji: '🦷',
    doctor: {
      name: 'drg. Sarah Mitchell',
      role: 'Spesialis Estetika Gigi & Veneer',
      avatarEmoji: '👩‍⚕️',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
      sampleChat: {
        user: 'Halo Dok, saya ingin konsultasi mengenai jadwal treatment untuk minggu ini.',
        doctor: 'Halo! Tentu, kami siap memberikan konsultasi dan jadwal terbaik untuk Anda.',
        recommendationTitle: 'Konsultasi Estetik & Check-up',
        recommendationDesc: 'Jadwalkan konsultasi dokter spesialis hari ini.',
      },
    },
    categories: ['Semua', 'Pemeriksaan', 'Scaling', 'Whitening', 'Estetika'],
    menu: [
      {
        id: 1,
        name: 'Consultation & Check-Up',
        desc: 'Evaluasi gigi dan mulut dengan dokter spesialis, termasuk foto intraoral.',
        price: '150.000',
        tag: 'Popular',
        category: 'Pemeriksaan',
        imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 2,
        name: 'Scaling & Polishing',
        desc: 'Pembersihan karang dan noda untuk menjaga kesehatan gusi & estetika.',
        price: '320.000',
        tag: 'Basic Care',
        category: 'Scaling',
        imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 3,
        name: 'Laser Teeth Whitening',
        desc: 'Perawatan pemutih gigi dengan laser modern untuk hasil maksimal dalam satu sesi.',
        price: '1.200.000',
        tag: 'Best Seller',
        category: 'Whitening',
        imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 4,
        name: 'Veneer Estetik Porcelain',
        desc: 'Solusi estetik untuk gigi patah, renggang, atau warna tidak merata.',
        price: '2.500.000',
        tag: 'Premium',
        category: 'Estetika',
        imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=300&auto=format&fit=crop&q=80',
      },
    ],
  };

  const client: BusinessDemo = {
    ...(baseClient || defaultFallback),
    name: (sParams.name as string) || (baseClient ? baseClient.name : defaultFallback.name),
    rating: sParams.rating ? parseFloat(sParams.rating as string) : (baseClient ? baseClient.rating : defaultFallback.rating),
    reviewCount: sParams.reviews ? parseInt(sParams.reviews as string) : (baseClient ? baseClient.reviewCount : defaultFallback.reviewCount),
    phone: (sParams.phone as string) || (baseClient ? baseClient.phone : defaultFallback.phone),
    address: (sParams.address as string) || (baseClient ? baseClient.address : defaultFallback.address),
    waNumber: sParams.phone
      ? (sParams.phone as string).replace(/\+/g, '').replace(/\s+/g, '')
      : (baseClient ? baseClient.waNumber : defaultFallback.waNumber),
  };

  return <ClinicDemoClient client={client} />;
}
