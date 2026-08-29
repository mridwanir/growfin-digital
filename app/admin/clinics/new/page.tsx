'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClinicAction, TreatmentInput } from '@/app/admin/actions';

export default function NewClinicPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Klinik Gigi & Estetika Medis');
  const [city, setCity] = useState('Bandung');
  const [rating, setRating] = useState('4.9');
  const [reviewCount, setReviewCount] = useState('120');
  const [phone, setPhone] = useState('+62 896-6807-8854');
  const [waNumber, setWaNumber] = useState('6289668078854');
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('https://maps.google.com');
  const [hours, setHours] = useState('Senin - Sabtu: 08:00 - 20:00');
  const [tagline, setTagline] = useState('Layanan Medis & Perawatan Terpercaya untuk Anda');
  const [iconEmoji, setIconEmoji] = useState('🩺');

  // Doctor Info
  const [doctorName, setDoctorName] = useState('');
  const [doctorRole, setDoctorRole] = useState('Spesialis Medis Utama');
  const [doctorAvatarEmoji, setDoctorAvatarEmoji] = useState('👩‍⚕️');
  const [doctorAvatarUrl, setDoctorAvatarUrl] = useState('');
  const [doctorSampleUser, setDoctorSampleUser] = useState('Halo Dok, saya ingin konsultasi mengenai jadwal treatment.');
  const [doctorSampleDoctor, setDoctorSampleDoctor] = useState('Halo! Tentu, kami siap memberikan rekomendasi & jadwal terbaik untuk Anda.');

  // Treatments Dynamic List
  const [treatments, setTreatments] = useState<TreatmentInput[]>([
    {
      name: 'Consultation & Check-Up',
      desc: 'Evaluasi kesehatan fisik & pemeriksaan awal dokter spesialis.',
      price: 'Rp 150.000',
      tag: 'Popular',
      category: 'Pemeriksaan',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80',
      sortOrder: 1,
      isActive: true,
    },
  ]);

  const addTreatment = () => {
    setTreatments((prev) => [
      ...prev,
      {
        name: '',
        desc: '',
        price: 'Rp ',
        category: 'Umum',
        sortOrder: prev.length + 1,
        isActive: true,
      },
    ]);
  };

  const removeTreatment = (index: number) => {
    setTreatments((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTreatment = (index: number, field: keyof TreatmentInput, value: unknown) => {
    setTreatments((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createClinicAction({
        slug,
        name,
        category,
        city,
        rating: parseFloat(rating) || 5.0,
        reviewCount: parseInt(reviewCount) || 100,
        phone,
        waNumber,
        address,
        googleMapsUrl,
        hours,
        tagline,
        iconEmoji,
        doctorName,
        doctorRole,
        doctorAvatarEmoji,
        doctorAvatarUrl: doctorAvatarUrl || undefined,
        doctorSampleUser,
        doctorSampleDoctor,
        treatments,
      });

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan data klinik';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <Link href="/admin" className="text-xs text-blue-400 font-bold hover:underline mb-1 inline-block">
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-black text-white">+ Tambah Mitra Klinik Baru</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Isi formulir untuk langsung mendaftarkan klinik baru ke database & membuat rute demo.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: Informasi Klinik */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span>🏥</span> 1. Informasi Utama Klinik
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nama Klinik *</label>
                <input
                  type="text"
                  placeholder="Contoh: Klinik Medika Utama"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL Slug (Dinamis) *</label>
                <input
                  type="text"
                  placeholder="klinik-medika-utama"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-blue-400 font-mono outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Kategori Klinik *</label>
                <input
                  type="text"
                  placeholder="Klinik Gigi & Estetika Medis"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Kota *</label>
                <input
                  type="text"
                  placeholder="Bandung"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nomor WhatsApp Booking *</label>
                <input
                  type="text"
                  placeholder="6289668078854 (Format tanpa +)"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nomor Telepon Tampilan</label>
                <input
                  type="text"
                  placeholder="+62 896-6807-8854"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Rating Google Maps</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Jumlah Ulasan Google</label>
                <input
                  type="number"
                  value={reviewCount}
                  onChange={(e) => setReviewCount(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Alamat Lengkap *</label>
              <textarea
                rows={2}
                placeholder="Jl. Utama No. 123, Bandung..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Link Google Maps URL</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Icon Emoji</label>
                <input
                  type="text"
                  placeholder="🩺 / 🦷 / ✨"
                  value={iconEmoji}
                  onChange={(e) => setIconEmoji(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500 text-center text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Tagline Klinik</label>
              <input
                type="text"
                placeholder="Layanan Medis & Perawatan Terpercaya untuk Anda"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* SECTION 2: Informasi Dokter Utama */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span>👩‍⚕️</span> 2. Informasi Dokter Spesialis / Utama
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nama Dokter *</label>
                <input
                  type="text"
                  placeholder="dr. Sarah Mitchell"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Gelar / Spesialisasi</label>
                <input
                  type="text"
                  placeholder="Spesialis Estetika & Dokter Umum"
                  value={doctorRole}
                  onChange={(e) => setDoctorRole(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Foto Avatar Dokter (URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={doctorAvatarUrl}
                  onChange={(e) => setDoctorAvatarUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Avatar Emoji Fallback</label>
                <input
                  type="text"
                  placeholder="👩‍⚕️ / 👨‍⚕️"
                  value={doctorAvatarEmoji}
                  onChange={(e) => setDoctorAvatarEmoji(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500 text-center"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Katalog Layanan / Treatments (Dynamic Array) */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>📋</span> 3. Katalog Layanan & Treatment Medis
              </h2>
              <button
                type="button"
                onClick={addTreatment}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl"
              >
                + Tambah Treatment
              </button>
            </div>

            <div className="space-y-4">
              {treatments.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-400">
                      Treatment #{idx + 1}
                    </span>
                    {treatments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTreatment(idx)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Nama Layanan *</label>
                      <input
                        type="text"
                        placeholder="Scaling Gigi & Polishing"
                        value={item.name}
                        onChange={(e) => updateTreatment(idx, 'name', e.target.value)}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Harga *</label>
                      <input
                        type="text"
                        placeholder="Rp 250.000"
                        value={item.price}
                        onChange={(e) => updateTreatment(idx, 'price', e.target.value)}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Kategori Layanan *</label>
                      <input
                        type="text"
                        placeholder="Pemeriksaan / Scaling / Estetika"
                        value={item.category}
                        onChange={(e) => updateTreatment(idx, 'category', e.target.value)}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Badge Tag (Opsional)</label>
                      <input
                        type="text"
                        placeholder="Popular / Best Seller"
                        value={item.tag || ''}
                        onChange={(e) => updateTreatment(idx, 'tag', e.target.value)}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Deskripsi Layanan</label>
                      <input
                        type="text"
                        placeholder="Pembersihan karang gigi ultrasonik..."
                        value={item.desc}
                        onChange={(e) => updateTreatment(idx, 'desc', e.target.value)}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Urutan (sort_order)</label>
                      <input
                        type="number"
                        value={item.sortOrder}
                        onChange={(e) => updateTreatment(idx, 'sortOrder', parseInt(e.target.value) || 0)}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id={`active-${idx}`}
                        checked={item.isActive}
                        onChange={(e) => updateTreatment(idx, 'isActive', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600"
                      />
                      <label htmlFor={`active-${idx}`} className="text-xs font-bold text-slate-300 cursor-pointer">
                        Status Aktif (is_active)
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
            <Link href="/admin" className="px-5 py-3 text-xs font-bold text-slate-400 hover:text-white">
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-600/30 disabled:opacity-50 transition-all"
            >
              {loading ? 'Menyimpan...' : 'Simpan & Terbitkan Klinik ➔'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
