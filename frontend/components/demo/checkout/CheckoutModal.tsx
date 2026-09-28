'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { X, Lock, CheckCircle2, ChevronRight, Mail, Key } from 'lucide-react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

export function CheckoutModal({ isOpen, onClose, slug }: CheckoutModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<'auth' | 'payment' | 'success'>('auth');
  const [userId, setUserId] = useState<string | null>(null);
  
  // Auth States
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Payment States
  const packages = [
    { id: 'basic', name: 'Basic Plan', price: 3000, desc: 'Cocok untuk coba-coba' },
    { id: 'pro', name: 'Pro Plan', price: 4000, desc: 'Pilihan terpopuler' },
    { id: 'enterprise', name: 'Enterprise', price: 5000, desc: 'Fitur terlengkap' }
  ];
  const [selectedPackage, setSelectedPackage] = useState(packages[0]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      setIsCheckingSession(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        setStep('payment');
      } else {
        setStep('auth');
      }
      setIsCheckingSession(false);
    };
    if (isOpen) checkSession();
  }, [isOpen]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');

    try {
      // Create user or Sign in
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // If user exists, try to sign in instead
        if (error.message.includes('already registered')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (signInError) throw signInError;
          setUserId(signInData.user.id);
        } else {
          throw error;
        }
      } else if (data.user) {
        setUserId(data.user.id);
      }

      // Automatically move to payment step
      setStep('payment');

    } catch (err: any) {
      setAuthError(err.message || 'Terjadi kesalahan saat otentikasi.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsPaymentLoading(true);
    try {
      // Get midtrans token from backend
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          slug, 
          amount: selectedPackage.price,
          package_tier: selectedPackage.id,
          user_id: userId
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mendapatkan token pembayaran');

      // Trigger Midtrans Snap
      // @ts-ignore
      window.snap.pay(data.token, {
        onSuccess: async function (result: any) {
          // Update status in backend or database directly
          await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: result.order_id, slug })
          });
          setStep('success');
        },
        onPending: function (result: any) {
          alert('Menunggu pembayaran Anda...');
        },
        onError: function (result: any) {
          alert('Pembayaran gagal! Silakan coba lagi.');
        },
        onClose: function () {
          alert('Anda menutup pop-up pembayaran sebelum menyelesaikannya.');
        }
      });

    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Load Midtrans Snap.js */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
        <div className="bg-[#14141A] border border-[#262633] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#262633]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#00b894]" />
              {step === 'auth' ? 'Amankan Website Anda' : step === 'payment' ? 'Selesaikan Pembayaran' : 'Selamat!'}
            </h2>
            {step !== 'success' && (
              <button onClick={onClose} className="text-[#8E8EA0] hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Stepper */}
          {step !== 'success' && (
            <div className="flex p-6 bg-[#0B0B0E] border-b border-[#262633]">
              <div className={`flex items-center text-sm font-semibold ${step === 'auth' ? 'text-[#00b894]' : 'text-[#8E8EA0]'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 border-2 ${step === 'auth' ? 'border-[#00b894]' : 'border-[#262633]'}`}>1</div>
                Buat Akun
              </div>
              <div className="mx-4 text-[#262633]">
                <ChevronRight className="w-5 h-5" />
              </div>
              <div className={`flex items-center text-sm font-semibold ${step === 'payment' ? 'text-[#00b894]' : 'text-[#8E8EA0]'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 border-2 ${step === 'payment' ? 'border-[#00b894]' : 'border-[#262633]'}`}>2</div>
                Pembayaran
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {isCheckingSession ? (
              <div className="py-12 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-[#262633] border-t-[#00b894] rounded-full animate-spin"></div>
              </div>
            ) : step === 'auth' ? (
              <form onSubmit={handleAuth} className="space-y-4">
                <p className="text-[#8E8EA0] text-sm mb-6">
                  Buat akun untuk mengklaim kepemilikan website ini. Nantinya akun ini digunakan untuk masuk ke Dashboard Admin.
                </p>
                {authError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                    {authError}
                  </div>
                )}
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8EA0]" />
                    <input 
                      type="email" 
                      placeholder="Email Anda"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0B0B0E] border border-[#262633] rounded-xl pl-11 pr-4 py-3 text-white focus:border-[#00b894] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8EA0]" />
                    <input 
                      type="password" 
                      placeholder="Password (Min. 6 karakter)"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#0B0B0E] border border-[#262633] rounded-xl pl-11 pr-4 py-3 text-white focus:border-[#00b894] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full mt-6 py-3 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-colors"
                >
                  {isAuthLoading ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
                </button>
              </form>
            ) : step === 'payment' ? (
              <div className="space-y-6">
                
                {/* Package Selection */}
                <div className="grid gap-3">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        selectedPackage.id === pkg.id 
                          ? 'border-[#00b894] bg-[#00b894]/10 ring-1 ring-[#00b894]' 
                          : 'border-[#262633] bg-[#14141A] hover:border-[#8E8EA0]'
                      }`}
                    >
                      <div>
                        <div className={`font-bold ${selectedPackage.id === pkg.id ? 'text-[#00b894]' : 'text-white'}`}>
                          {pkg.name}
                        </div>
                        <div className="text-xs text-[#8E8EA0] mt-1">{pkg.desc}</div>
                      </div>
                      <div className={`font-black text-lg ${selectedPackage.id === pkg.id ? 'text-[#00b894]' : 'text-white'}`}>
                        Rp {pkg.price.toLocaleString('id-ID')}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-[#0B0B0E] border border-[#262633] rounded-xl p-5">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-sm text-[#8E8EA0]">
                      <CheckCircle2 className="w-4 h-4 text-[#00b894] mr-2" /> Akses Dashboard Seumur Hidup
                    </li>
                    <li className="flex items-center text-sm text-[#8E8EA0]">
                      <CheckCircle2 className="w-4 h-4 text-[#00b894] mr-2" /> Hapus Label Demo
                    </li>
                    <li className="flex items-center text-sm text-[#8E8EA0]">
                      <CheckCircle2 className="w-4 h-4 text-[#00b894] mr-2" /> Dukungan Domain Kustom (.com/.id)
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-[#262633] flex justify-between items-center">
                    <span className="text-white font-medium">Total Pembayaran</span>
                    <span className="text-2xl font-black text-[#00b894]">Rp {selectedPackage.price.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isPaymentLoading}
                  className="w-full py-4 bg-[#00b894] hover:bg-[#00e0b8] text-[#14141A] font-black rounded-xl transition-colors shadow-[0_0_20px_rgba(0,184,148,0.3)] text-lg"
                >
                  {isPaymentLoading ? 'Memuat Midtrans...' : 'Bayar Sekarang'}
                </button>
              </div>
            ) : step === 'success' ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-[#00b894]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-[#00b894]" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Pembayaran Berhasil!</h3>
                <p className="text-[#8E8EA0] mb-8">
                  Website Anda kini resmi berstatus aktif dan siap dikelola 100% melalui Dashboard.
                </p>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-4 bg-white hover:bg-gray-200 text-[#14141A] font-bold rounded-xl transition-colors"
                >
                  Masuk ke Dashboard Saya
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
