'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'generate' | 'find'>('generate');
  const [step, setStep] = useState<'form' | 'loading' | 'existing' | 'confirmation'>('form');
  const [realName, setRealName] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Restaurant',
    phone: '',
    city: '',
    mapsUrl: '',
    force: false
  });

  const [findPhone, setFindPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step === 'loading') {
        const message = 'Proses AI sedang berjalan! Jika Anda memuat ulang (refresh) halaman, pembuatan website Anda bisa gagal atau terhenti.';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step]);

  if (!isOpen) return null;

  const validatePhone = (phone: string) => {
    if (!phone) return 'Nomor WhatsApp tidak boleh kosong.';
    if (!/^\d+$/.test(phone)) return 'Nomor WhatsApp hanya boleh berisi angka.';
    if (!phone.startsWith('628')) return 'Format salah. Harus diawali dengan 628 (contoh: 62812...). Jangan gunakan 08...';
    if (phone.length > 15) return 'Maksimal 15 digit angka.';
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'generate' | 'find') => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 15) {
      if (field === 'generate') {
        setFormData({ ...formData, phone: val });
      } else {
        setFindPhone(val);
      }
    }
  };

  const handleSubmitGenerate = async (e?: React.FormEvent, isForce = false) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      setErrorMsg(phoneError);
      return;
    }

    setStep('loading');

    try {
      const payload = { ...formData, force: isForce };
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.needsConfirmation) {
        setRealName(data.realName);
        setStep('confirmation');
        return;
      }

      if (data.success && data.slug) {
        if (data.isExisting) {
          setStep('existing');
          setTimeout(() => {
            router.push(`/demo/${data.slug}`);
            onClose();
            setStep('form');
          }, 3000);
        } else {
          setTimeout(() => {
            router.push(`/demo/${data.slug}`);
            onClose();
            setStep('form');
          }, 3000);
        }
      } else {
        setErrorMsg(data.error || 'Gagal membuat template.');
        setStep('form');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('Terjadi kesalahan jaringan.');
      setStep('form');
    }
  };

  const handleSubmitFind = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const phoneError = validatePhone(findPhone);
    if (phoneError) {
      setErrorMsg(phoneError);
      return;
    }

    setStep('loading');

    try {
      const res = await fetch('/api/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: findPhone }),
      });

      const data = await res.json();

      if (data.success && data.slug) {
        setStep('existing');
        setTimeout(() => {
          router.push(`/demo/${data.slug}`);
          onClose();
          setStep('form');
        }, 2000);
      } else {
        setErrorMsg(data.error || 'Nomor tidak ditemukan.');
        setStep('form');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('Terjadi kesalahan jaringan.');
      setStep('form');
    }
  };

  const categoryGroups = [
    {
      label: 'F&B (Food & Beverage)',
      options: [
        'Restaurant',
        'Cafe & Coffee Shop',
        'Bakery & Dessert Shop',
        'Fast Food Restaurant',
        'Bubble Tea Shop / Juice Shop',
      ]
    },
    {
      label: 'Grooming (Beauty & Personal Care)',
      options: [
        'Beauty Salon',
        'Hair Salon & Barbershop',
        'Nail Salon',
        'Day Spa & Massage Spa',
        'Skin Care Clinic',
        'Make-up Artist'
      ]
    },
    {
      label: 'Retail (Shopping / Toko Fisik)',
      options: [
        'Supermarket & Grocery Store',
        'Convenience Store',
        'Clothing Store & Boutique',
        'Electronics Store',
        'Shoe Store',
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => {
        if (step === 'form') {
          onClose();
          setTimeout(() => { setStep('form'); setMode('generate'); setErrorMsg(''); }, 300);
        }
      }}></div>
      <div className="relative bg-white rounded-[2rem] p-8 max-w-md w-full border-4 border-emerald-soft shadow-2xl animate-pop-up z-10 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-soft blob-shape opacity-50"></div>
        
        {step === 'form' && (
          <button
            onClick={() => {
              onClose();
              setTimeout(() => { setStep('form'); setMode('generate'); setErrorMsg(''); }, 300);
            }}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="relative z-10">
          
          {step === 'form' && mode === 'generate' && (
            <>
              <h3 className="text-2xl font-extrabold text-dark mb-1">Ceritakan Bisnis Anda</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">Isi detail singkat ini, dan sistem kami akan meracik website untuk Anda!</p>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center font-bold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmitGenerate} className="space-y-4">
                <div>
                  <input type="text" className="w-full px-5 py-3.5 border-2 border-slate-100 rounded-2xl text-sm bg-slate-50 focus:outline-none focus:border-emerald focus:bg-white transition-all" placeholder="Nama Bisnis" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <select className="w-full px-5 py-3.5 border-2 border-slate-100 rounded-2xl text-sm bg-slate-50 text-slate-600 focus:outline-none focus:border-emerald focus:bg-white transition-all" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="" disabled>Kategori Bisnis</option>
                    {categoryGroups.map(group => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <input type="tel" className="w-full px-5 py-3.5 border-2 border-slate-100 rounded-2xl text-sm bg-slate-50 focus:outline-none focus:border-emerald focus:bg-white transition-all" placeholder="Nomor WhatsApp (Cth: 628...)" required value={formData.phone} onChange={(e) => handlePhoneChange(e, 'generate')} />
                </div>
                <div>
                  <input type="text" className="w-full px-5 py-3.5 border-2 border-slate-100 rounded-2xl text-sm bg-slate-50 focus:outline-none focus:border-emerald focus:bg-white transition-all" placeholder="Kota" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <div>
                  <input type="url" className="w-full px-5 py-3.5 border-2 border-slate-100 rounded-2xl text-sm bg-slate-50 focus:outline-none focus:border-emerald focus:bg-white transition-all" placeholder="Link Google Maps" required value={formData.mapsUrl} onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })} />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full py-4 bg-emerald hover:bg-emerald-light text-white font-extrabold rounded-2xl shadow-[0_10px_20px_rgba(0,184,148,0.2)] hover:shadow-[0_15px_25px_rgba(0,184,148,0.3)] transition-all active:scale-95">
                    Buat Website Sekarang
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button onClick={() => { setMode('find'); setErrorMsg(''); }} className="text-slate-400 hover:text-emerald text-xs font-bold transition-colors">
                  Sudah punya template? Masuk di sini
                </button>
              </div>
            </>
          )}

          {step === 'form' && mode === 'find' && (
            <>
              <h3 className="text-2xl font-extrabold text-dark mb-1">Cari Template Anda</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">Masukkan nomor WA yang Anda daftarkan sebelumnya.</p>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center font-bold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmitFind} className="space-y-4">
                <div>
                  <input type="tel" className="w-full px-5 py-3.5 border-2 border-slate-100 rounded-2xl text-sm bg-slate-50 focus:outline-none focus:border-emerald focus:bg-white transition-all" placeholder="Nomor WhatsApp" required value={findPhone} onChange={(e) => handlePhoneChange(e, 'find')} />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full py-4 bg-emerald hover:bg-emerald-light text-white font-extrabold rounded-2xl shadow-[0_10px_20px_rgba(0,184,148,0.2)] hover:shadow-[0_15px_25px_rgba(0,184,148,0.3)] transition-all active:scale-95">
                    Buka Template Saya
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button onClick={() => { setMode('generate'); setErrorMsg(''); }} className="text-slate-400 hover:text-emerald text-xs font-bold transition-colors">
                  ← Kembali ke pendaftaran baru
                </button>
              </div>
            </>
          )}

          {step === 'loading' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-emerald/20 border-4 border-emerald-soft rounded-full animate-ping"></div>
                <div className="w-full h-full bg-emerald-soft border-4 border-emerald rounded-full flex items-center justify-center relative z-10">
                  <div className="w-4 h-4 bg-emerald rounded-full animate-bounce"></div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-dark">Membangun Website Anda...</h3>
                <p className="text-sm text-slate-500 font-medium">Sistem sedang meracik tampilan terbaik untuk bisnis Anda.</p>
              </div>
              <div className="w-full max-w-xs bg-slate-100 rounded-full h-2.5 mt-4 overflow-hidden relative">
                <div className="bg-emerald h-2.5 rounded-full animate-[progress_3s_ease-in-out_infinite]" style={{ width: '100%', transformOrigin: 'left' }}></div>
              </div>
            </div>
          )}

          {step === 'existing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                <div className="w-20 h-20 bg-blue-50 border-2 border-blue-500 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-dark">Data Ditemukan!</h3>
                <p className="text-sm text-slate-500 font-medium">Mengarahkan Anda ke Live Preview sekarang...</p>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                <div className="w-20 h-20 bg-yellow-50 border-2 border-yellow-500 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-dark">Konfirmasi Data Bisnis</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Berdasarkan Link Google Maps, nama bisnis Anda terdeteksi sebagai: <br />
                  <span className="text-lg font-bold text-yellow-600 block mt-2 mb-1">{realName}</span>
                  (Berbeda dengan yang Anda input: <span className="font-semibold text-dark">{formData.name}</span>).
                </p>
                <p className="text-sm text-slate-500 font-medium">Apakah Anda ingin melanjutkan dengan nama asli dari Google Maps?</p>
              </div>

              <div className="flex w-full gap-3 pt-4">
                <button
                  onClick={() => { setStep('form'); }}
                  className="flex-1 py-3 px-4 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-colors"
                >
                  Ubah Data
                </button>
                <button
                  onClick={() => handleSubmitGenerate(undefined, true)}
                  className="flex-1 py-3 px-4 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-extrabold rounded-xl transition-all shadow-[0_5px_15px_rgba(234,179,8,0.3)] active:scale-95"
                >
                  Ya, Lanjutkan
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
