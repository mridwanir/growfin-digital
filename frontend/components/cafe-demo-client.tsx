'use client';

import { useState } from 'react';
import { Coffee, MapPin, Clock, Phone } from 'lucide-react';
import { MockData } from '@/lib/mock-data';

interface Profile extends MockData {
  name: string;
  category: string;
  city: string;
  phone: string;
  waNumber: string;
  mapsUrl: string;
}

export function CafeDemoClient({ profile }: { profile: Profile }) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(profile.products.map(p => p.category)))];
  const filteredProducts = activeCategory === 'Semua'
    ? profile.products
    : profile.products.filter(p => p.category === activeCategory);

  const waUrl = `https://wa.me/${profile.waNumber}?text=Halo%20${encodeURIComponent(profile.name)},%20saya%20mau%20reservasi%20tempat.`;

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans text-amber-950 selection:bg-amber-900 selection:text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-amber-900/10">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-900 text-white rounded-full flex items-center justify-center shadow-lg">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight">{profile.name}</span>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-amber-900 hover:bg-amber-800 text-white text-sm font-bold rounded-full transition-colors"
          >
            Reservasi Meja
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src={profile.heroImage} alt="Cafe Background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-6">
            {profile.category} · {profile.city}
          </span>
          <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight leading-tight">
            Sensasi Rasa <br /> di Setiap Tegukan
          </h1>
          <p className="text-lg sm:text-xl text-amber-900/80 max-w-2xl mx-auto mb-10 font-medium">
            {profile.tagline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#menu" className="w-full sm:w-auto px-8 py-4 bg-amber-900 hover:bg-amber-800 text-white font-bold rounded-full transition-all">
              Lihat Menu Kami
            </a>
            <a href={profile.mapsUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-white border border-amber-200 hover:border-amber-900 text-amber-950 font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-sm">
              <MapPin className="w-4 h-4" /> Kunjungi Lokasi
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-amber-900 text-amber-50">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-10">
          {profile.features.map(f => (
            <div key={f.id} className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-800 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="text-amber-200 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="py-24 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Our Signature Menu</h2>
          <p className="text-amber-900/70">Dibuat dengan bahan premium dan penuh cinta.</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === c
                  ? 'bg-amber-900 text-white shadow-md'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {filteredProducts.map(p => (
            <div key={p.id} className="p-6 bg-white border border-amber-100 rounded-3xl shadow-sm hover:shadow-xl transition-shadow flex justify-between items-center group">
              <div>
                <h4 className="text-lg font-bold mb-1">{p.name}</h4>
                <p className="text-sm text-amber-900/60 leading-relaxed max-w-[250px]">{p.desc}</p>
              </div>
              <div className="text-right">
                <span className="block text-xl font-black text-amber-900 mb-2">{p.price}</span>
                <button className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full group-hover:bg-amber-100 transition-colors">
                  Pesan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-amber-950 text-amber-50/80 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl font-black text-white">{profile.name}</h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /> {profile.hours}</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> {profile.city}</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-400" /> {profile.phone}</span>
          </div>
          <p className="text-xs pt-8 border-t border-amber-900">
            Powered by Growfin Digital Templates. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
