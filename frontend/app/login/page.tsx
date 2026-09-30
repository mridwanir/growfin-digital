'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Mail, Key, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createClient();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal login. Periksa kembali email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <img src="/image/landing/growfin-logo-icon.png" alt="Growfin Logo" className="w-10 h-10 object-contain" />
        <span className="text-dark font-extrabold tracking-tight text-2xl">Growfin</span>
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-6 h-6 text-emerald" />
          </div>
          <h1 className="text-2xl font-bold text-dark">Login Dashboard</h1>
          <p className="text-slate-500 text-sm mt-2">Kelola bisnis dan website Anda</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm text-center font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-slate-800 focus:border-emerald focus:bg-white focus:outline-none transition-colors text-sm"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-slate-800 focus:border-emerald focus:bg-white focus:outline-none transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-emerald hover:bg-emerald-light text-white font-extrabold rounded-2xl shadow-[0_10px_20px_rgba(0,184,148,0.2)] hover:shadow-[0_15px_25px_rgba(0,184,148,0.3)] transition-all active:scale-95 mt-4"
          >
            {isLoading ? 'Memproses...' : 'Masuk ke Akun'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link href="/" className="text-emerald hover:text-emerald-light font-bold">
              Buat Website Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
