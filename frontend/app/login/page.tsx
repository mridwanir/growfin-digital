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
    <div className="min-h-screen bg-[#0B0B0E] flex flex-col items-center justify-center p-4">
      
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <svg viewBox="0 0 100 100" className="w-10 h-10 text-[#00b894]" fill="currentColor">
          <path d="M50 0L100 25V75L50 100L0 75V25L50 0ZM50 18.5L20 33.5V66.5L50 81.5L80 66.5V33.5L50 18.5Z" />
        </svg>
        <span className="text-white font-black tracking-tight text-2xl">Growfin</span>
      </Link>

      <div className="bg-[#14141A] border border-[#262633] rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#00b894]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-6 h-6 text-[#00b894]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Login Dashboard</h1>
          <p className="text-[#8E8EA0] text-sm mt-2">Kelola bisnis dan website Anda</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8E8EA0] uppercase">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8EA0]" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0B0E] border border-[#262633] rounded-xl pl-11 pr-4 py-3 text-white focus:border-[#00b894] focus:outline-none transition-colors"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8E8EA0] uppercase">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8EA0]" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0B0E] border border-[#262633] rounded-xl pl-11 pr-4 py-3 text-white focus:border-[#00b894] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#00b894] hover:bg-[#00e0b8] text-[#14141A] font-bold rounded-xl transition-colors mt-4"
          >
            {isLoading ? 'Memproses...' : 'Masuk ke Akun'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#262633] text-center">
          <p className="text-sm text-[#8E8EA0]">
            Belum punya akun?{' '}
            <Link href="/" className="text-[#00b894] hover:underline font-semibold">
              Buat Website Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
