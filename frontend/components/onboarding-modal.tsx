'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, MapPin, Phone, Building2, Link as LinkIcon, Sparkles, X, Search } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'generate' | 'find'>('generate');
  const [step, setStep] = useState<'form' | 'loading' | 'existing'>('form');
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Klinik',
    phone: '',
    city: '',
    mapsUrl: '',
  });

  const [findPhone, setFindPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Prevent page refresh when loading
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
    // Check if empty
    if (!phone) return 'Nomor WhatsApp tidak boleh kosong.';
    // Check if only numbers
    if (!/^\d+$/.test(phone)) return 'Nomor WhatsApp hanya boleh berisi angka.';
    // Check if starts with 628
    if (!phone.startsWith('628')) return 'Format salah. Nomor harus diawali dengan 628 (contoh: 62812...). Jangan gunakan 08...';
    // Check max 15 digits
    if (phone.length > 15) return 'Maksimal 15 digit angka.';
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'generate' | 'find') => {
    const val = e.target.value.replace(/\D/g, ''); // Remove non-numeric instantly if typed
    if (val.length <= 15) {
      if (field === 'generate') {
        setFormData({ ...formData, phone: val });
      } else {
        setFindPhone(val);
      }
    }
  };

  const handleSubmitGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      setErrorMsg(phoneError);
      return;
    }

    setStep('loading');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (data.success && data.slug) {
        if (data.isExisting) {
          // Tell the user we found their existing template
          setStep('existing');
          setTimeout(() => {
            router.push(`/demo/${data.slug}`);
            onClose();
            setStep('form');
          }, 3000);
        } else {
          // Standard animation
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

  const categories = ['Klinik', 'Cafe', 'Resto', 'Salon / Barbershop', 'Retail', 'Jasa Lainnya'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0B0B0E] border border-[#262633] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,184,148,0.15)] animate-in zoom-in-95 duration-300">
        
        {/* Close Button - Hide when loading/existing */}
        {step === 'form' && (
          <button 
            onClick={() => {
              onClose();
              setTimeout(() => { setStep('form'); setMode('generate'); setErrorMsg(''); }, 300);
            }}
            className="absolute top-4 right-4 p-2 bg-[#14141A] rounded-full text-[#8E8EA0] hover:text-white hover:bg-[#262633] transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {step === 'form' && mode === 'generate' && (
          <div className="p-8 pb-6 max-h-[85vh] overflow-y-auto">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#00b894]/10 rounded-full mb-4">
                <Sparkles className="w-6 h-6 text-[#00e0b8]" />
              </div>
              <h2 className="text-2xl font-black text-white">Generate Your Template</h2>
              <p className="text-sm text-[#8E8EA0] mt-2">
                Isi detail bisnis Anda, dan AI kami akan membangun website live dalam hitungan detik.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitGenerate} className="space-y-4">
              
              {/* Nama Bisnis */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8E8EA0] uppercase tracking-wider">Nama Bisnis</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-[#8E8EA0]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#14141A] border border-[#262633] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#8E8EA0]/50 focus:outline-none focus:border-[#00b894] focus:ring-1 focus:ring-[#00b894] transition-all"
                    placeholder="Contoh: Kopi Senja"
                  />
                </div>
              </div>

              {/* Kategori Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8E8EA0] uppercase tracking-wider">Kategori Bisnis</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#14141A] border border-[#262633] rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#00b894] focus:ring-1 focus:ring-[#00b894] transition-all appearance-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <div className="w-2 h-2 border-r-2 border-b-2 border-[#8E8EA0] transform rotate-45"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Whatsapp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8E8EA0] uppercase tracking-wider">Nomor WhatsApp</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-[#8E8EA0]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e, 'generate')}
                      className="w-full bg-[#14141A] border border-[#262633] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#8E8EA0]/50 focus:outline-none focus:border-[#00b894] focus:ring-1 focus:ring-[#00b894] transition-all"
                      placeholder="62812..."
                    />
                  </div>
                </div>

                {/* Kota */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8E8EA0] uppercase tracking-wider">Kota</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-[#8E8EA0]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#14141A] border border-[#262633] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#8E8EA0]/50 focus:outline-none focus:border-[#00b894] focus:ring-1 focus:ring-[#00b894] transition-all"
                      placeholder="Bandung"
                    />
                  </div>
                </div>
              </div>

              {/* Google Maps Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8E8EA0] uppercase tracking-wider">Link Google Maps</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-[#8E8EA0]" />
                  </div>
                  <input
                    type="url"
                    required
                    value={formData.mapsUrl}
                    onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                    className="w-full bg-[#14141A] border border-[#262633] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#8E8EA0]/50 focus:outline-none focus:border-[#00b894] focus:ring-1 focus:ring-[#00b894] transition-all"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#00b894] hover:bg-[#00e0b8] text-white text-sm font-black rounded-xl transition-all shadow-lg active:scale-[0.98]"
                >
                  Generate Template Sekarang 🚀
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => { setMode('find'); setErrorMsg(''); }}
                className="text-[#8E8EA0] hover:text-[#00e0b8] text-xs font-semibold transition-colors"
              >
                Sudah pernah buat template? Akses kembali di sini.
              </button>
            </div>
          </div>
        )}

        {step === 'form' && mode === 'find' && (
          <div className="p-8">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#00b894]/10 rounded-full mb-4">
                <Search className="w-6 h-6 text-[#00e0b8]" />
              </div>
              <h2 className="text-2xl font-black text-white">Cari Template Anda</h2>
              <p className="text-sm text-[#8E8EA0] mt-2">
                Masukkan nomor WhatsApp yang Anda gunakan sebelumnya untuk mengakses kembali live preview Anda.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitFind} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8E8EA0] uppercase tracking-wider">Nomor WhatsApp terdaftar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-[#8E8EA0]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={findPhone}
                    onChange={(e) => handlePhoneChange(e, 'find')}
                    className="w-full bg-[#14141A] border border-[#262633] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#8E8EA0]/50 focus:outline-none focus:border-[#00b894] focus:ring-1 focus:ring-[#00b894] transition-all"
                    placeholder="62812..."
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#00b894] hover:bg-[#00e0b8] text-white text-sm font-black rounded-xl transition-all shadow-lg active:scale-[0.98]"
                >
                  Cari & Buka Template 🔍
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => { setMode('generate'); setErrorMsg(''); }}
                className="text-[#8E8EA0] hover:text-[#00e0b8] text-xs font-semibold transition-colors"
              >
                ← Kembali ke pendaftaran baru
              </button>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00b894] blur-xl opacity-20 rounded-full animate-pulse"></div>
              <div className="w-20 h-20 bg-[#14141A] border-2 border-[#00b894] rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(0,184,148,0.3)]">
                <Bot className="w-10 h-10 text-[#00e0b8] animate-bounce" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">AI Sedang Bekerja...</h3>
              <p className="text-sm text-[#8E8EA0]">Memproses data bisnis dan menyusun layout template Anda.</p>
            </div>
            
            <div className="w-full max-w-xs h-2 bg-[#262633] rounded-full overflow-hidden mt-4">
              <div className="h-full bg-gradient-to-r from-[#00b894] to-[#00e0b8] animate-progress w-full origin-left"></div>
            </div>
          </div>
        )}

        {step === 'existing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
              <div className="w-20 h-20 bg-[#14141A] border-2 border-blue-500 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <Sparkles className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Template Ditemukan!</h3>
              <p className="text-sm text-[#8E8EA0]">Nomor ini sudah memiliki template. Mengarahkan Anda ke live preview sekarang...</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
