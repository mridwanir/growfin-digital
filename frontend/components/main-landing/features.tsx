'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Zap,
  Lock,
  Star,
  CheckCheck,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

const DEMO_PRODUCTS: ProductItem[] = [
  { id: 'p1', name: 'Signature Cold Brew', price: 28000, category: 'Minuman' },
  { id: 'p2', name: 'Almond Croissant', price: 26000, category: 'Pastry' },
  { id: 'p3', name: 'Matcha Cream Latte', price: 32000, category: 'Minuman' },
];

export function Features() {
  const whatsappNumber = siteConfig?.contact?.whatsappNumber || '6289630352370';

  // State for interactive WhatsApp order simulation
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(['p1', 'p2']);

  // State for interactive promo toggle
  const [isPromoActive, setIsPromoActive] = useState<boolean>(true);

  const toggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      if (selectedProductIds.length > 1) {
        setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
      }
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const selectedProducts = DEMO_PRODUCTS.filter((p) => selectedProductIds.includes(p.id));
  const rawTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const discountMultiplier = isPromoActive ? 0.8 : 1.0;
  const finalTotal = Math.round(rawTotal * discountMultiplier);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="layanan" className="py-24 lg:py-32 bg-ice-white relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header: Direct benefit-led headline without kicker */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-midnight-navy tracking-tight leading-[1.15] mb-5 text-balance">
            Dibuat Khusus untuk Mengubah Pengunjung Menjadi{' '}
            <span className="text-electric-blue">Pelanggan Setia.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-body leading-relaxed max-w-xl mx-auto text-pretty">
            Hilangkan kerumitan teknis. Dari alur checkout instan via WhatsApp hingga pembaruan katalog mandiri dari ponsel, setiap bagian dirancang untuk mempercepat penjualan bisnis Anda.
          </p>
        </div>

        {/* Bento Grid: 12-column asymmetric layout showcasing real value */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card 1: WhatsApp Checkout Engine (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-soft-gray/30 shadow-xs hover-lift flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-electric-blue/10 flex items-center justify-center text-electric-blue shrink-0">
                  <MessageSquare className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-midnight-navy text-balance">
                    Pesanan Otomatis Masuk Langsung ke WhatsApp
                  </h3>
                  <p className="text-xs text-slate-body/80 font-medium text-pretty">
                    Closing penjualan 3x lebih cepat tanpa form pendaftaran rumit
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-body leading-relaxed mb-6 text-pretty max-w-lg">
                Calon pembeli cukup memilih menu atau produk di website Anda. Sekali klik tombol beli, sistem merangkum rincian barang, harga, dan format pesanan rapi yang langsung terkirim ke chat WhatsApp admin Anda.
              </p>
            </div>
          </div>

          {/* Card 2: Self-Managed Mobile Dashboard (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-soft-gray/30 shadow-xs hover-lift flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-electric-blue/10 flex items-center justify-center text-electric-blue shrink-0">
                  <Smartphone className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-midnight-navy text-balance">
                    Kendali Penuh dari HP Tanpa Koder
                  </h3>
                  <p className="text-xs text-slate-body/80 font-medium text-pretty">
                    Bebas update menu, promo, dan harga kapan saja
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-body leading-relaxed mb-6 text-pretty">
                Tak perlu bayar jutaan rupiah ke agensi web hanya untuk mengganti harga atau memasang promo akhir pekan. Buka dashboard dari smartphone Anda, lakukan perubahan semudah kirim chat, dan website langsung terupdate seketika.
              </p>
            </div>
          </div>

          {/* Card 3: Credibility & Custom Domain (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-soft-gray/30 shadow-xs hover-lift flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <Globe className="w-5 h-5 text-electric-blue shrink-0" strokeWidth={2} />
                <h3 className="text-lg font-bold text-midnight-navy text-balance">
                  Kredibilitas Brand Terpercaya
                </h3>
              </div>
              <p className="text-sm text-slate-body leading-relaxed mb-5 text-pretty">
                Konsumen jauh lebih yakin bertransaksi pada bisnis dengan domain resmi (.com/.id) dan integrasi peta lokasi dibanding tautan media sosial biasa.
              </p>
            </div>
          </div>

          {/* Card 4: Sub-1s Mobile Speed & SEO (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-soft-gray/30 shadow-xs hover-lift flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <Zap className="w-5 h-5 text-electric-blue shrink-0" strokeWidth={2} />
                <h3 className="text-lg font-bold text-midnight-navy text-balance">
                  Loading Kilat di Bawah 1 Detik
                </h3>
              </div>
              <p className="text-sm text-slate-body leading-relaxed mb-5 text-pretty">
                53% calon pembeli menutup website yang memuat lebih dari 3 detik. Infrastruktur kami dioptimasi ringan agar katalog terbuka seketika di ponsel pelanggan.
              </p>
            </div>
          </div>

          {/* Card 5: Zero Tech Headache & Support (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-soft-gray/30 shadow-xs hover-lift flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <ShieldCheck className="w-5 h-5 text-electric-blue shrink-0" strokeWidth={2} />
                <h3 className="text-lg font-bold text-midnight-navy text-balance">
                  Terima Beres Tanpa Pusing Server
                </h3>
              </div>
              <p className="text-sm text-slate-body leading-relaxed mb-5 text-pretty">
                Lupakan error database, sertifikat SSL kedaluwarsa, atau server down saat ramai promo. Semua keamanan dan performa dikelola penuh oleh tim kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
